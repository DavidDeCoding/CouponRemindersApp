import os
import boto3
import base64
from coupon_reminders.services.ocr import ocr

COUPONS_TABLE = os.environ['COUPONS_TABLE']
COUPONS_BUCKET = os.environ['COUPONS_BUCKET']

db_client = boto3.client('dynamodb')
s3_client = boto3.client('s3')


def process_and_store(
    image_full_name: str
):
    image_response = s3_client.get_object(
        Bucket=COUPONS_BUCKET,
        Key=image_full_name
    )
    image = image_response['Body'].read()
    image_base64 = base64.b64encode(image)
    processed_text = ocr(image_base64)

    user_id, timestamp, image_id = image_full_name.split(".")[0].split("/")
    db_client.put_item(
        TableName=COUPONS_TABLE,
        Item={
            'userId': {'S': user_id},
            'timestamp': {'N': timestamp},
            'imageBytes': {'S': image_id},
            'processedText': {'S': processed_text}
        }
    )
    return
