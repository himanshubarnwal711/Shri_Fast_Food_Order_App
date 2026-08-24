import json
import boto3

TABLE_NAME = "mealsList"
REGION = "ap-south-1"

dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

with open("meals.json", "r", encoding="utf-8") as f:
    meals = json.load(f)

with table.batch_writer() as batch:
    for meal in meals:
        batch.put_item(Item=meal)

print(f"Successfully uploaded {len(meals)} meals to {TABLE_NAME}")