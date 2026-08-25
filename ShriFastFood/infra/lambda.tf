# Meals Lambda Function

data "archive_file" "meals_lambda" {
  type        = "zip"
  source_file = "${path.module}/../backend/meals/handler.py"
  output_path = "${path.module}/meals_lambda.zip"
}

resource "aws_lambda_function" "meals" {
  function_name = "${var.project_name}-${var.environment}-meals"

  role = aws_iam_role.meals_lambda_role.arn

  runtime = "python3.12"
  handler = "handler.handler"

  filename         = data.archive_file.meals_lambda.output_path
  source_code_hash = data.archive_file.meals_lambda.output_base64sha256

  timeout     = 10
  memory_size = 256

  environment {
    variables = {
      MEALS_TABLE_NAME = aws_dynamodb_table.meals.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy.meals_dynamodb_policy
  ]

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

# Order Email Lambda Function

data "archive_file" "order_email_lambda" {
  type = "zip"

  source_file = "${path.module}/../backend/order_email_lambda/handler.py"

  output_path = "${path.module}/order_email_lambda.zip"
}

resource "aws_lambda_function" "order_email" {
  function_name = "${var.project_name}-${var.environment}-order-email"

  role = aws_iam_role.order_email_lambda_role.arn

  runtime = "python3.12"
  handler = "handler.lambda_handler"

  filename         = data.archive_file.order_email_lambda.output_path
  source_code_hash = data.archive_file.order_email_lambda.output_base64sha256

  timeout     = 30
  memory_size = 256

  environment {
    variables = {
      GMAIL_SECRET_NAME = aws_secretsmanager_secret.gmail_credentials.name
      OWNER_EMAIL       = "himroadies01@gmail.com"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.order_email_lambda_basic_execution,
    aws_iam_role_policy_attachment.order_email_secret_access
  ]

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}
