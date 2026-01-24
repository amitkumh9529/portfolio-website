# backend/main.py
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pytesseract
from PIL import Image
import io
import re
import time
from datetime import datetime

from database import get_db, Document

app = FastAPI()

# CONFIGURATION
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_invoice_fields(text):
    """Enhanced extraction logic with multiple patterns and better parsing"""
    
    # Clean up text - remove extra spaces and normalize
    text = re.sub(r'\s+', ' ', text)
    text_lines = text.split('\n')
    
    # INVOICE NUMBER
    invoice_number = None
    patterns = [
        r'INVOICE\s*#\s*:?\s*([A-Z0-9\-]+)',
        r'Invoice\s*Number\s*:?\s*([A-Z0-9\-]+)',
        r'INV\s*#?\s*:?\s*([A-Z0-9\-]+)',
        r'Invoice\s*#\s*([A-Z0-9\-]+)',
        r'(BPXINV-\d+)',
        r'([A-Z]{2,}INV-\d+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            invoice_number = match.group(1)
            break
    
    # DATE
    date = None
    date_patterns = [
        r'DATE\s*:?\s*(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{4})',
        r'Invoice\s*Date\s*:?\s*(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{4})',
        r'Date\s*:?\s*(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{4})',
        r'(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{4})',
        r'(\d{1,2}/\d{1,2}/\d{4})',
        r'(\d{4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2})',
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            date = match.group(1)
            if any(sep in date for sep in ['.', '/', '-']):
                parts = re.split(r'[\.\/\-]', date)
                if len(parts) == 3 and all(p.isdigit() for p in parts):
                    date_nums = [int(p) for p in parts]
                    if any(n <= 31 for n in date_nums) and any(n <= 12 for n in date_nums):
                        break
            date = None
    
    # VENDOR
    vendor = None
    for i, line in enumerate(text_lines[:15]):
        line = line.strip()
        if line and len(line) >= 3 and len(line) < 100:
            skip_words = ['INVOICE', 'DATE', 'PHONE', 'EMAIL', 'WWW', 'HTTP', 'HTTPS', 
                         'FAX', 'TEL', 'BILL TO', 'SHIP TO', 'SOLD TO']
            if not any(skip.lower() in line.lower() for skip in skip_words):
                if re.search(r'[A-Za-z]{2,}', line):
                    if not line.replace(' ', '').isdigit():
                        vendor = line
                        break
    
    # TOTAL
    total = None
    total_patterns = [
        r'TOTAL\s+DUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'TOTAL\s*DUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'TOTALDUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'TOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'Amount\s+Due\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'AMOUNT\s+DUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'Grand\s+Total\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'GRAND\s+TOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'Balance\s+Due\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
        r'BALANCE\s+DUE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})',
    ]
    
    for pattern in total_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            total = match.group(1)
            break
    
    if not total:
        for line in text_lines:
            if 'TOTAL' in line.upper() and 'DUE' in line.upper():
                numbers = re.findall(r'[\d,]+\.?\d{0,2}', line)
                if numbers:
                    total = numbers[-1]
                    break
    
    if not total:
        subtotal_match = re.search(r'SUBTOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})', text, re.IGNORECASE)
        if subtotal_match:
            total = subtotal_match.group(1)
    
    if total:
        total = total.strip()
    
    return {
        'invoice_number': invoice_number,
        'date': date,
        'vendor_name': vendor,
        'total': total
    }

def extract_from_lines(text):
    """Alternative extraction by analyzing line by line"""
    lines = text.split('\n')
    
    invoice_number = None
    date = None
    vendor = None
    total = None
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        if not invoice_number:
            if 'INVOICE' in line.upper() and '#' in line:
                match = re.search(r'#\s*([A-Z0-9\-]+)', line)
                if match:
                    invoice_number = match.group(1)
        
        if not date:
            if 'DATE' in line.upper() and ':' in line:
                after_colon = line.split(':', 1)[1].strip()
                date_match = re.search(r'(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{4})', after_colon)
                if date_match:
                    date = date_match.group(1)
        
        if not vendor and i < 5:
            if len(line) >= 3 and not any(x in line.upper() for x in ['INVOICE', 'DATE', 'PHONE', 'WWW']):
                if re.search(r'[A-Za-z]', line):
                    vendor = line
        
        if not total:
            if 'TOTAL' in line.upper() and 'DUE' in line.upper():
                numbers = re.findall(r'([\d,]+\.?\d{2})', line)
                if numbers:
                    total = max(numbers, key=lambda x: float(x.replace(',', '')))
    
    return {
        'invoice_number': invoice_number,
        'date': date,
        'vendor_name': vendor,
        'total': total
    }

def validate_file(file: UploadFile):
    """Validate file size and type"""
    file_ext = '.' + file.filename.split('.')[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return True

@app.post("/api/process")
async def process_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    start_time = time.time()
    
    validate_file(file)
    
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file")
    
    try:
        if file.filename.lower().endswith('.pdf'):
            from pdf2image import convert_from_bytes
            images = convert_from_bytes(contents, dpi=300)
            image = images[0]
        else:
            image = Image.open(io.BytesIO(contents))
        
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, config=custom_config)
        
        method1 = extract_invoice_fields(text)
        method2 = extract_from_lines(text)
        
        extracted = {
            'invoice_number': method1['invoice_number'] or method2['invoice_number'],
            'date': method1['date'] or method2['date'],
            'vendor_name': method1['vendor_name'] or method2['vendor_name'],
            'total': method1['total'] or method2['total']
        }
        
        processing_time = time.time() - start_time
        
        doc = Document(
            filename=file.filename,
            invoice_number=extracted['invoice_number'],
            date=extracted['date'],
            total=extracted['total'],
            vendor_name=extracted['vendor_name'],
            raw_text=text,
            processing_time=processing_time,
            status="success"
        )
        
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        return {
            "status": "success",
            "document_id": doc.id,
            "filename": file.filename,
            "file_size_mb": round(file_size / (1024*1024), 2),
            "extracted_fields": {
                "invoice_number": doc.invoice_number,
                "date": doc.date,
                "total": doc.total,
                "vendor_name": doc.vendor_name
            },
            "raw_text": text,
            "processing_time": round(processing_time, 2)
        }
        
    except Exception as e:
        processing_time = time.time() - start_time
        
        doc = Document(
            filename=file.filename,
            status="failed",
            raw_text=str(e),
            processing_time=processing_time
        )
        db.add(doc)
        db.commit()
        
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "IDP Platform API Running", "version": "2.0"}

@app.get("/api/config")
def get_config():
    return {
        "max_file_size_mb": MAX_FILE_SIZE / (1024*1024),
        "allowed_extensions": list(ALLOWED_EXTENSIONS),
        "max_files_per_batch": 50
    }

@app.get("/api/documents")
def get_all_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).order_by(Document.upload_date.desc()).all()
    return {
        "total": len(documents),
        "documents": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "upload_date": doc.upload_date,
                "invoice_number": doc.invoice_number,
                "date": doc.date,
                "total": doc.total,
                "vendor_name": doc.vendor_name,
                "status": doc.status,
                "processing_time": doc.processing_time
            }
            for doc in documents
        ]
    }

@app.get("/api/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return {"error": "Document not found"}
    
    return {
        "id": doc.id,
        "filename": doc.filename,
        "upload_date": doc.upload_date,
        "extracted_fields": {
            "invoice_number": doc.invoice_number,
            "date": doc.date,
            "total": doc.total,
            "vendor_name": doc.vendor_name
        },
        "raw_text": doc.raw_text,
        "processing_time": doc.processing_time,
        "status": doc.status
    }

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_docs = db.query(Document).count()
    successful_docs = db.query(Document).filter(Document.status == "success").count()
    
    docs_with_total = db.query(Document).filter(Document.total.isnot(None)).all()
    total_amount = 0
    for doc in docs_with_total:
        try:
            amount_str = str(doc.total).replace('$', '').replace(',', '').strip()
            amount = float(amount_str)
            total_amount += amount
        except:
            pass
    
    avg_time_docs = db.query(Document).filter(Document.processing_time.isnot(None)).all()
    avg_processing_time = sum([d.processing_time for d in avg_time_docs]) / len(avg_time_docs) if avg_time_docs else 0
    
    docs_with_invoice = db.query(Document).filter(Document.invoice_number.isnot(None)).count()
    accuracy_rate = (docs_with_invoice / total_docs * 100) if total_docs > 0 else 0
    
    return {
        "total_documents": total_docs,
        "successful_documents": successful_docs,
        "failed_documents": total_docs - successful_docs,
        "total_amount_processed": round(total_amount, 2),
        "average_processing_time": round(avg_processing_time, 2),
        "accuracy_rate": round(accuracy_rate, 1)
    }

@app.delete("/api/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return {"error": "Document not found"}
    
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@app.post("/api/debug-text")
async def debug_text(file: UploadFile = File(...)):
    """Debug endpoint to see raw OCR output line by line"""
    contents = await file.read()
    
    if file.filename.lower().endswith('.pdf'):
        from pdf2image import convert_from_bytes
        images = convert_from_bytes(contents, dpi=300)
        image = images[0]
    else:
        image = Image.open(io.BytesIO(contents))
    
    text = pytesseract.image_to_string(image)
    lines = text.split('\n')
    
    numbered_lines = [f"Line {i+1}: '{line}'" for i, line in enumerate(lines[:30])]
    
    method1 = extract_invoice_fields(text)
    method2 = extract_from_lines(text)
    
    return {
        "total_lines": len(lines),
        "first_30_lines": numbered_lines,
        "method_1_results": method1,
        "method_2_results": method2,
        "full_text_preview": text[:1000]
    }