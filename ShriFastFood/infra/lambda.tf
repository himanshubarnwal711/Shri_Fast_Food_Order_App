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
