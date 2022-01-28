<!--
title: 'Coupon Reminders App'
description: 'App built using FastAPI + Tesseract, deployed to AWS Lambda with Serverless Framework.'
layout: Doc
framework: v2
platform: AWS
language: python
priority: 2
authorLink: 'https://github.com/daviddecoding'
authorName: 'DavidDecoding'
-->


# Coupon Reminders App

This app allows customers to:
1. Add their existing coupons using their Mobile Phone.
2. Get reminders to use coupon before it expires.
3. Additional Features (will be expanded to):
   1. If location is shared by customer, reminds customer about an unexpired coupon from the current location.
   2. If customer providers preferred shopping destinations, customers will be prompted about coupons from found in the internet.

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy --stage stagging
```

After running deploy, you should see output similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service aws-python.zip file to S3 (711.23 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.................................
Serverless: Stack update finished...
Service Information
service: aws-python
stage: dev
region: us-east-1
stack: aws-python-dev
resources: 6
functions:
  api: aws-python-dev-hello
layers:
  None
```

### Destroy

```
$ serverless remove --stage stagging
```

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service aws-python.zip file to S3 (711.23 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.................................
Serverless: Stack update finished...
Service Information
service: aws-python
stage: dev
region: us-east-1
stack: aws-python-dev
resources: 6
functions:
  api: aws-python-dev-hello
layers:
  None
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function app --data ''
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\"message\": \"Go Serverless v2.0! Your function executed successfully!\", \"input\": {}}"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function app --data ''
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "{\"message\": \"Go Serverless v2.0! Your function executed successfully!\", \"input\": {}}"
}
```