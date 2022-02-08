import datetime
import os
import boto3
import uuid

COUPONS_TABLE = os.environ['COUPONS_TABLE']
COUPONS_BUCKET = os.environ['COUPONS_BUCKET']

db_client = boto3.client('dynamodb')
s3_client = boto3.client('s3')


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
