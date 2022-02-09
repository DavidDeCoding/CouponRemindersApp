from coupon_reminders.services import processed_coupon


def handler(event, context):
    for event in event["Records"]:
        if event["eventName"] == "ObjectCreated:Put":
            image_full_name = event["s3"]["object"]["key"]
            processed_coupon.process_and_store(image_full_name)
    return
