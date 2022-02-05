import os

from fastapi import FastAPI

from coupon_reminders.models.image_to_text_request import ImageToTextRequest
from coupon_reminders.models.image_to_text_response import ImageToTextResponse
from coupon_reminders.services.ocr import ocr
from coupon_reminders.services.store_and_retrieve import store_coupon

stage = os.environ.get('STAGE', None)
openapi_prefix = f"/{stage}" if stage else "/"

app = FastAPI(title="Coupon Reminders App", openapi_prefix=openapi_prefix)


@app.post("/imageToText")
def image_to_text(image_to_text_request: ImageToTextRequest) -> ImageToTextResponse:
    store_coupon("test", image_to_text_request.imageBytes)
    # text = ocr(image_to_text_request.imageBytes)
    text = ""
    return ImageToTextResponse(text=text)
