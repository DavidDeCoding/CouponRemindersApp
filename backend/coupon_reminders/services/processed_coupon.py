import os
import boto3
from coupon_reminders.services.ocr import ocr

PROCESSED_COUPONS_TABLE = os.environ['PROCESSED_COUPONS_TABLE']
client = boto3.client('dynamodb')


def process_and_store(
        user_id: str,
        timestamp: str,
        image_bytes: str
):
    processed_text = ""
    status = "Failure"
    try:
        processed_text = ocr(image_bytes)
        status = "Success"
    except BaseException as ex:
        print(ex)

    client.put_item(
        TableName=PROCESSED_COUPONS_TABLE,
        Item={
            'userId': {'S': user_id},
            'timestamp': {'N': timestamp},
            'imageBytes': {'S': image_bytes},
            'processedText': {'S': processed_text},
            'status': {'S': status}
        }
    )
