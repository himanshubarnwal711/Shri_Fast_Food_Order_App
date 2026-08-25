resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-${var.environment}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "http://localhost:3000",
      "https://shrifastfood.netlify.app"
    ]

    allow_methods = [
      "GET",
      "POST",
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


# ---------------------------------------------------------
# MEALS LAMBDA INTEGRATION
# ---------------------------------------------------------

resource "aws_apigatewayv2_integration" "meals" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.meals.invoke_arn

  payload_format_version = "2.0"
}


# ---------------------------------------------------------
# ORDER EMAIL LAMBDA INTEGRATION
# ---------------------------------------------------------

resource "aws_apigatewayv2_integration" "order_email" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.order_email.invoke_arn

  payload_format_version = "2.0"
}


# ---------------------------------------------------------
# GET /meals
# ---------------------------------------------------------

resource "aws_apigatewayv2_route" "get_meals" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "GET /meals"

  target = "integrations/${aws_apigatewayv2_integration.meals.id}"
}


# ---------------------------------------------------------
# POST /orders
# ---------------------------------------------------------

resource "aws_apigatewayv2_route" "create_order" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "POST /orders"

  target = "integrations/${aws_apigatewayv2_integration.order_email.id}"
}


# ---------------------------------------------------------
# DEFAULT STAGE
# ---------------------------------------------------------

resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.main.id

  name = "$default"

  auto_deploy = true

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}


# ---------------------------------------------------------
# API GATEWAY -> MEALS LAMBDA PERMISSION
# ---------------------------------------------------------

resource "aws_lambda_permission" "api_gateway" {
  statement_id = "AllowAPIGatewayInvoke"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.meals.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}


# ---------------------------------------------------------
# API GATEWAY -> ORDER EMAIL LAMBDA PERMISSION
# ---------------------------------------------------------

resource "aws_lambda_permission" "api_gateway_order_email" {
  statement_id = "AllowAPIGatewayInvokeOrderEmail"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.order_email.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
