import datetime
import os
import boto3

COUPONS_TABLE = os.environ['COUPONS_TABLE']
client = boto3.client('dynamodb')


def store_coupon(
        user_id: str,
        image_bytes: str
):
    client.put_item(
        TableName=COUPONS_TABLE,
        Item={
            'userId': {'S': user_id},
            'timestamp': {'N': str(int(datetime.datetime.utcnow().timestamp()))},
            'imageBytes': {'S': image_bytes}
        }
    )
