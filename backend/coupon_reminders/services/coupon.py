from __future__ import annotations
from pydantic import BaseModel

import datetime
import os
import boto3
import uuid
import base64
from typing import List
from coupon_reminders.services.ocr import ocr

COUPONS_TABLE = os.environ['COUPONS_TABLE']
COUPONS_BUCKET = os.environ['COUPONS_BUCKET']
DATE_STRING_FORMAT = '%m/%d/%Y'

db_client = boto3.client('dynamodb')
s3_client = boto3.client('s3')


class Coupon(BaseModel):
    user_id: str
    add_on: str
    name: str
    expires_on: str

    @staticmethod
    def store(
        user_id: str
    ) -> str:
        image_id = str(uuid.uuid4())
        timestamp = str(int(datetime.datetime.utcnow().timestamp()))

        db_client.put_item(
            TableName=COUPONS_TABLE,
            Item={
                'userId': {'S': user_id},
                'timestamp': {'N': timestamp},
                'imageId': {'S': image_id}
            }
        )
        s3_presigned_url = s3_client.generate_presigned_url(
            'put_object',
            ExpiresIn=360000,
            Params={
                'Bucket': COUPONS_BUCKET,
                'Key': f"{user_id}/{timestamp}/{image_id}.jpeg",
                'ContentType': 'application/octet-stream'
            }
        )
        return s3_presigned_url

    @staticmethod
    def retrieve_latest_all(
        user_id: str
    ) -> List[Coupon]:
        result = db_client.query(
            TableName=COUPONS_TABLE,
            KeyConditionExpression='userId = :userId',
            ExpressionAttributeValues={
                ':userId': {'S': user_id}
            }
        )

        return [
                Coupon(
                    user_id=item['userId']['S'],
                    add_on=datetime.datetime.fromtimestamp(int(item['timestamp']['N'])).strftime(DATE_STRING_FORMAT),
                    name='TestCoupon1',
                    expires_on='123')
                for item in result['Items']
            ]

    @staticmethod
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
