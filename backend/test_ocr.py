# test_ocr.py
import pytesseract
from PIL import Image

# Download a sample invoice from Google Images or use your own
image = Image.open("C:\\Users\\amith\\Downloads\\sample.jpg")
text = pytesseract.image_to_string(image)

print("EXTRACTED TEXT:")
print(text)