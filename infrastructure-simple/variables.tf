variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# Demo: Added comment to test IaC pipeline
# This change will trigger terraform-ci.yml workflow

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "todo-tasks-simple"
}

variable "frontend_bucket_name" {
  description = "S3 bucket for frontend"
  type        = string
  default     = "todo-frontend-simple"
}
