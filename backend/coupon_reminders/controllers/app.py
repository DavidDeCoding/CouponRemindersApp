import os
from fastapi import FastAPI
from coupon_reminders.models.image_to_text_request import ImageToTextRequest
from coupon_reminders.services import raw_coupon

stage = os.environ.get('STAGE', None)
openapi_prefix = f"/{stage}" if stage else "/"

app = FastAPI(title="Coupon Reminders App", openapi_prefix=openapi_prefix)


@app.post("/imageToText")
def image_to_text(image_to_text_request: ImageToTextRequest):
    raw_coupon.store("test", image_to_text_request.imageBytes)
    return
