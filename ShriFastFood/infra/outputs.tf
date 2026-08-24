output "api_url" {
  description = "API Gateway URL"

  value = aws_apigatewayv2_stage.default.invoke_url
}

output "meals_api_url" {
  description = "Meals API URL"

  value = "${aws_apigatewayv2_stage.default.invoke_url}/meals"
}

output "lambda_function_name" {
  description = "Lambda function name"

  value = aws_lambda_function.meals.function_name
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"

  value = aws_dynamodb_table.meals.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"

  value = aws_dynamodb_table.meals.arn
}
