from coupon_reminders.services import processed_coupon


def handler(event, context):
    for event in event["Records"]:
        if event["eventName"] == "INSERT":
            processed_coupon.process_and_store(
                event["dynamodb"]["NewImage"]["userId"]["S"],
                event["dynamodb"]["NewImage"]["timestamp"]["N"],
                event["dynamodb"]["NewImage"]["imageBytes"]["S"]
            )
    return
