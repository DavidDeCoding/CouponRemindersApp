from pydantic import BaseModel
from typing import List
from coupon_reminders.services.coupon import Coupon


class GetCouponsResponse(BaseModel):
    coupons: List[Coupon]
