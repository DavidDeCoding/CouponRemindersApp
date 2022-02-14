from coupon_reminders.services.coupon import Coupon


def handler(event, context):
    for event in event["Records"]:
        if event["eventName"] == "ObjectCreated:Put":
            image_full_name = event["s3"]["object"]["key"]
            Coupon.process_and_store(image_full_name)
    return
