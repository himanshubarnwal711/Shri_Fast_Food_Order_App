resource "aws_iam_role" "meals_lambda_role" {
  name = "${var.project_name}-${var.environment}-meals-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "lambda.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.meals_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "meals_dynamodb_policy" {
  name = "${var.project_name}-${var.environment}-meals-dynamodb-policy"
  role = aws_iam_role.meals_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "dynamodb:Scan"
        ]

        Resource = aws_dynamodb_table.meals.arn
      }
    ]
  })
}

resource "aws_iam_role" "order_email_lambda_role" {
  name = "${var.project_name}-${var.environment}-order-email-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "lambda.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "order_email_lambda_basic_execution" {
  role       = aws_iam_role.order_email_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "order_email_secret_policy" {
  name = "${var.project_name}-${var.environment}-order-email-secret-policy"

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "secretsmanager:GetSecretValue"
        ]

        Resource = aws_secretsmanager_secret.gmail_credentials.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "order_email_secret_access" {
  role       = aws_iam_role.order_email_lambda_role.name
  policy_arn = aws_iam_policy.order_email_secret_policy.arn
}
