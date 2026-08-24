resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-${var.environment}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "http://localhost:3000"
    ]

    allow_methods = [
      "GET",
      "OPTIONS"
    ]

    allow_headers = [
      "content-type"
    ]

    max_age = 300
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_apigatewayv2_integration" "meals" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.meals.invoke_arn

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_meals" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "GET /meals"

  target = "integrations/${aws_apigatewayv2_integration.meals.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.main.id

  name = "$default"

  auto_deploy = true

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id = "AllowAPIGatewayInvoke"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.meals.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
