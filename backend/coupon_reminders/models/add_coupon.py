from pydantic import BaseModel


class AddCouponRequest(BaseModel):
    user_id: str


class AddCouponResponse(BaseModel):
    url: str
