# Input Variables
# These can be overridden via terraform.tfvars or -var flags

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "todo-app"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for tasks"
  type        = string
  default     = "todo-tasks"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "todo-api-function"
}

variable "frontend_bucket_name" {
  description = "S3 bucket name for frontend (must be globally unique)"
  type        = string
  default     = "todo-app-frontend"
  # Note: You may need to change this to ensure global uniqueness
}
