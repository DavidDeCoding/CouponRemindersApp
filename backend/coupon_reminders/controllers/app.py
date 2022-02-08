import os
from fastapi import FastAPI
from coupon_reminders.services import raw_coupon

stage = os.environ.get('STAGE', None)
openapi_prefix = f"/{stage}" if stage else "/"

app = FastAPI(title="Coupon Reminders App", openapi_prefix=openapi_prefix)


@app.post("/imageToText")
def image_to_text():
    return raw_coupon.store("test")
