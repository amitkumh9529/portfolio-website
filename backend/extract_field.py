# extract_fields.py
import pytesseract
from PIL import Image
import re

def extract_invoice_fields(image_path):
    text = pytesseract.image_to_string(Image.open(image_path))
    
    # Simple regex patterns
    invoice_number = re.search(r'Invoice[#\s]*:?\s*(\w+)', text, re.IGNORECASE)
    date = re.search(r'Date[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', text, re.IGNORECASE)
    total = re.search(r'Total[:\s]*\$?\s*([\d,]+\.?\d{0,2})', text, re.IGNORECASE)
    
    return {
        'invoice_number': invoice_number.group(1) if invoice_number else None,
        'date': date.group(1) if date else None,
        'total': total.group(1) if total else None,
        'raw_text': text
    }

# Test it
result = extract_invoice_fields("E:\IDP\backend\sample.jpg")
print("\nEXTRACTED FIELDS:")
for field, value in result.items():
    if field != 'raw_text':
        print(f"{field}: {value}")