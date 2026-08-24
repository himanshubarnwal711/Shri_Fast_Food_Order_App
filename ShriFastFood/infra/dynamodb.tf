resource "aws_dynamodb_table" "meals" {
  name         = var.meals_table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "Id"

  attribute {
    name = "Id"
    type = "N"
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
    Name        = var.meals_table_name
  }
}
