import json
import os
from decimal import Decimal

import boto3


# DynamoDB
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["MEALS_TABLE_NAME"])


def convert_decimals(obj):
    """
    Convert DynamoDB Decimal values into normal Python integers.
    Since Id and price are integers in this application,
    Decimal values are converted to int.
    """
    if isinstance(obj, Decimal):
        return int(obj)

    if isinstance(obj, list):
        return [convert_decimals(item) for item in obj]

    if isinstance(obj, dict):
        return {
            key: convert_decimals(value)
            for key, value in obj.items()
        }

    return obj


def handler(event, context):
    try:
        response = table.scan()

        meals = response.get("Items", [])

        # Convert DynamoDB Decimal values to JSON-compatible integers
        meals = convert_decimals(meals)

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(meals)
        }

    except Exception as e:
        print(f"Error fetching meals: {e}")

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Unable to fetch meals"
            })
        }