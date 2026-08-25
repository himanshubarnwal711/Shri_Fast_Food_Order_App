variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "shri-fast-food"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "meals_table_name" {
  description = "DynamoDB meals table name"
  type        = string
  default     = "mealsList"
}

variable "gmail_secret_name" {
  description = "AWS Secrets Manager secret containing Gmail credentials"
  type        = string
  default     = "shri-fast-food/gmail-credentials"
}
