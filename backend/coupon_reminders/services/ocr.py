import base64
import io
import pytesseract
from PIL import Image


def ocr(image_bytes: str):

    image = io.BytesIO(base64.b64decode(image_bytes))
    text = pytesseract.image_to_string(Image.open(image))

    return text
