from mangum import Mangum
from coupon_reminders.controllers.app import app

handler = Mangum(app)
