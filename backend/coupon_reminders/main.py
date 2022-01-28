from coupon_reminders.controllers.app import app
from mangum import Mangum


handler = Mangum(app)
