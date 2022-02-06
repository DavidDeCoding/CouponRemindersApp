import datetime
import os
import boto3

RAW_COUPONS_TABLE = os.environ['RAW_COUPONS_TABLE']
client = boto3.client('dynamodb')


def store(
        user_id: str,
        image_bytes: str
):
    client.put_item(
        TableName=RAW_COUPONS_TABLE,
        Item={
            'userId': {'S': user_id},
            'timestamp': {'N': str(int(datetime.datetime.utcnow().timestamp()))},
            'imageBytes': {'S': image_bytes}
        }
    )
