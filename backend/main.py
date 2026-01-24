# backend/main.py - FINAL VERSION
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
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_invoice_data(text):
    """
    Robust extraction using multiple strategies
    Returns best results from all methods
    """
    
    lines = text.split('\n')
    
    # Clean up OCR artifacts - normalize whitespace
    clean_text = ' '.join(text.split())
    
    # Strategy 1: Invoice Number extraction
    invoice_number = None
    patterns = [
        r'(BPXINV-\d+)',
        r'INVOICE\s*#\s*:?\s*([A-Z0-9\-]+)',
        r'([A-Z]{2,5}INV-\d+)',
        r'Invoice\s*(?:No|Number|#)\s*:?\s*([A-Z0-9\-]+)',
        r'INV[#\-]?\s*:?\s*([A-Z0-9\-]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            invoice_number = match.group(1)
            break
    
    # Strategy 2: Date extraction - AGGRESSIVE search with OCR error handling
    date = None
    
    # Method 1: Find standard date patterns (DD.MM.YYYY, DD/MM/YYYY, etc.)
    date_formats = [
        r'(\d{2}\.\d{2}\.\d{4})',      # DD.MM.YYYY (European) - like 23.05.2021
        r'(\d{1,2}\.\d{1,2}\.\d{4})',  # D.M.YYYY flexible
        r'(\d{2}/\d{2}/\d{4})',         # DD/MM/YYYY or MM/DD/YYYY
        r'(\d{1,2}/\d{1,2}/\d{4})',     # D/M/YYYY flexible
        r'(\d{2}-\d{2}-\d{4})',         # DD-MM-YYYY
        r'(\d{4}-\d{2}-\d{2})',         # YYYY-MM-DD (ISO)
    ]
    
    for fmt in date_formats:
        matches = re.findall(fmt, text)
        for potential_date in matches:
            parts = re.split(r'[.\-/]', potential_date)
            try:
                nums = [int(p) for p in parts]
                if len(nums) == 3:
                    if nums[0] > 1900 and nums[0] < 2100:
                        if 1 <= nums[1] <= 12 and 1 <= nums[2] <= 31:
                            date = potential_date
                            break
                    elif nums[2] > 1900 and nums[2] < 2100:
                        if 1 <= nums[0] <= 31 and 1 <= nums[1] <= 12:
                            date = potential_date
                            break
            except:
                continue
        if date:
            break
    
    # Method 2: Handle OCR-corrupted dates near DATE: label
    # e.g., "DATE: 2 05 5021" should be "23.05.2021" or "DATE: 23.05." with year nearby
    if not date:
        # Look for DATE: followed by space-separated numbers (OCR corruption)
        date_match = re.search(r'DATE\s*:\s*(\d{1,2})\s+(\d{1,2})\s+(\d{4})', text, re.IGNORECASE)
        if date_match:
            day, month, year = date_match.group(1), date_match.group(2), date_match.group(3)
            # Fix common OCR errors: 5021 -> 2021, 5022 -> 2022
            if year.startswith('50'):
                year = '20' + year[2:]
            date = f"{day.zfill(2)}.{month.zfill(2)}.{year}"
    
    # Method 3: Look for partial date like "23.05." and find year nearby
    if not date:
        partial_match = re.search(r'(\d{1,2})\.(\d{1,2})\.\s*$', text, re.MULTILINE)
        if not partial_match:
            partial_match = re.search(r'(\d{1,2})\.(\d{1,2})\.\s*\n', text)
        if partial_match:
            day, month = partial_match.group(1), partial_match.group(2)
            # Look for a 4-digit year nearby (within 50 chars)
            start_pos = max(0, partial_match.start() - 50)
            end_pos = min(len(text), partial_match.end() + 50)
            nearby_text = text[start_pos:end_pos]
            year_match = re.search(r'(20\d{2}|50\d{2})', nearby_text)
            if year_match:
                year = year_match.group(1)
                # Fix OCR error: 5021 -> 2021
                if year.startswith('50'):
                    year = '20' + year[2:]
                date = f"{day.zfill(2)}.{month.zfill(2)}.{year}"
    
    # Method 4: Standard date near label as final backup
    if not date:
        date_label_patterns = [
            r'(?:Invoice\s*)?Date\s*[:\s]+(\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4})',
            r'Dated?\s*[:\s]+(\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4})',
        ]
        for pattern in date_label_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date = match.group(1)
                break
    
    # Strategy 3: Vendor name - first clean text line
    vendor = None
    for i, line in enumerate(lines[:15]):
        line = line.strip()
        if not line or len(line) < 3:
            continue
        if line.replace(' ', '').replace('-', '').replace('.', '').isdigit():
            continue
        
        skip_keywords = ['INVOICE', 'DATE', 'PHONE', 'FAX', 'EMAIL', 'WWW', 
                        'HTTP', 'BILL TO', 'SHIP TO', 'WE LOVE', 'CHEMISTRY',
                        'ADDRESS', 'TOTAL', 'AMOUNT', 'TAX', 'SUBTOTAL']
        if any(keyword in line.upper() for keyword in skip_keywords):
            continue
        
        if re.search(r'[A-Za-z]{2,}', line) and len(line) <= 50:
            vendor = line
            break
    
    # Strategy 4: Total Amount - FIND LARGEST MONETARY AMOUNT (Primary Strategy)
    # The grand total is almost always the largest number in an invoice
    total = None
    
    # Find ALL monetary amounts in the document (with decimal points)
    all_amounts = re.findall(r'(\d{1,3}(?:,\d{3})*\.\d{2}|\d+\.\d{2})', text)
    
    if all_amounts:
        # Convert to floats and collect
        amounts_float = []
        for amt in all_amounts:
            try:
                clean_amt = amt.replace(',', '')
                val = float(clean_amt)
                # Filter out likely non-monetary values (too small or looks like a date/phone)
                if val >= 1.00:  # At least $1
                    amounts_float.append((clean_amt, val))
            except:
                pass
        
        if amounts_float:
            # Get the LARGEST amount - this is most likely the grand total
            max_amount = max(amounts_float, key=lambda x: x[1])
            total = max_amount[0]
    
    # Fallback: Look for amounts without decimal (like "6610" or "6,610")
    if not total:
        # Try to find numbers near "Total" keywords
        total_line_patterns = [
            r'(?:Grand\s*)?Total[:\s]+\$?\s*([\d,]+(?:\.\d{2})?)',
            r'Amount\s*Due[:\s]+\$?\s*([\d,]+(?:\.\d{2})?)',
            r'Balance[:\s]+\$?\s*([\d,]+(?:\.\d{2})?)',
        ]
        for pattern in total_line_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                total = match.group(1).replace(',', '')
                break
    
    return {
        'invoice_number': invoice_number,
        'date': date,
        'vendor_name': vendor,
        'total': total
    }

def validate_file(file: UploadFile):
    """Validate file type"""
    file_ext = '.' + file.filename.split('.')[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return True

@app.post("/api/process")
async def process_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    start_time = time.time()
    
    # Validate
    validate_file(file)
    
    # Read file
    contents = await file.read()
    file_size = len(contents)
    
    # Check size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max: {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file")
    
    try:
        # Convert PDF to image - process ALL pages
        if file.filename.lower().endswith('.pdf'):
            from pdf2image import convert_from_bytes
            images = convert_from_bytes(contents, dpi=300)
            
            # OCR ALL pages and combine text
            custom_config = r'--oem 3 --psm 6'
            all_text = []
            for img in images:
                page_text = pytesseract.image_to_string(img, config=custom_config)
                all_text.append(page_text)
            text = '\n'.join(all_text)
        else:
            image = Image.open(io.BytesIO(contents))
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(image, config=custom_config)
        
        # Extract fields
        extracted = extract_invoice_data(text)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Save to database
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
        
        # Save failed document
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
    
    # Calculate total amount
    docs_with_total = db.query(Document).filter(Document.total.isnot(None)).all()
    total_amount = 0
    for doc in docs_with_total:
        try:
            amount_str = str(doc.total).replace('$', '').replace(',', '').strip()
            amount = float(amount_str)
            total_amount += amount
        except:
            pass
    
    # Average processing time
    avg_time_docs = db.query(Document).filter(Document.processing_time.isnot(None)).all()
    avg_processing_time = sum([d.processing_time for d in avg_time_docs]) / len(avg_time_docs) if avg_time_docs else 0
    
    # Accuracy rate
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

# Debug endpoint
@app.post("/api/debug")
async def debug_ocr(file: UploadFile = File(...)):
    """Debug OCR output"""
    contents = await file.read()
    
    if file.filename.lower().endswith('.pdf'):
        from pdf2image import convert_from_bytes
        images = convert_from_bytes(contents, dpi=300)
        # Process ALL pages
        all_text = []
        for img in images:
            page_text = pytesseract.image_to_string(img)
            all_text.append(page_text)
        text = '\n'.join(all_text)
        num_pages = len(images)
    else:
        image = Image.open(io.BytesIO(contents))
        text = pytesseract.image_to_string(image)
        num_pages = 1
    
    extracted = extract_invoice_data(text)
    
    lines = text.split('\n')[:50]
    
    return {
        "extracted": extracted,
        "num_pages": num_pages,
        "first_50_lines": [f"{i+1}: {line}" for i, line in enumerate(lines)],
        "raw_text_length": len(text),
        "raw_preview": text[:1000]
    }