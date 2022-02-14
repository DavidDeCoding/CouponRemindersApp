import os
from fastapi import FastAPI
from coupon_reminders.services.coupon import Coupon
from coupon_reminders.models.add_coupon import ( AddCouponRequest, AddCouponResponse )
from coupon_reminders.models.get_coupons import ( GetCouponsResponse )

stage = os.environ.get('STAGE', None)
openapi_prefix = f"/{stage}" if stage else "/"

app = FastAPI(title="Coupon Reminders App", openapi_prefix=openapi_prefix)


@app.post("/addCoupon")
def add_coupon(request: AddCouponRequest) -> AddCouponResponse:
    return AddCouponResponse(url=Coupon.store(request.user_id))


@app.get("/getCoupons/{user_id}")
def get_coupon(user_id: str) -> GetCouponsResponse:
    return GetCouponsResponse(coupons=Coupon.retrieve_latest_all(user_id))
