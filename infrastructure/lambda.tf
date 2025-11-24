# Lambda Function for Backend API
#
# Serverless compute running Express.js API
# Triggered by API Gateway HTTP requests

# Package backend code into a ZIP file
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist"
  output_path = "${path.module}/lambda-deployment.zip"
}

# IAM Role for Lambda execution
resource "aws_iam_role" "lambda_role" {
  name = "${var.lambda_function_name}-role"

  # Trust policy: Allow Lambda service to assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-lambda-role"
  }
}

# IAM Policy: CloudWatch Logs (for logging)
resource "aws_iam_role_policy" "lambda_logs" {
  name = "${var.lambda_function_name}-logs-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.lambda_function_name}:*"
      }
    ]
  })
}

# IAM Policy: DynamoDB access (least privilege - only this table)
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "${var.lambda_function_name}-dynamodb-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = aws_dynamodb_table.tasks.arn
      }
    ]
  })
}

# CloudWatch Log Group for Lambda logs
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 30 # Retain logs for 30 days

  tags = {
    Name = "${var.project_name}-lambda-logs"
  }
}

# Lambda Function
resource "aws_lambda_function" "api" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = var.lambda_function_name
  role            = aws_iam_role.lambda_role.arn
  handler         = "lambda.handler" # Points to exports.handler in lambda.js
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime         = "nodejs20.x"
  timeout         = 30 # 30 seconds timeout
  memory_size     = 512 # 512 MB memory

  # Environment variables for configuration
  environment {
    variables = {
      NODE_ENV            = var.environment
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.tasks.name
      AWS_REGION          = var.aws_region
      LOG_LEVEL           = "info"
      CORS_ORIGIN         = "*" # In production, set to specific frontend URL
    }
  }

  # Ensure log group exists before Lambda
  depends_on = [
    aws_cloudwatch_log_group.lambda_logs,
    aws_iam_role_policy.lambda_logs,
    aws_iam_role_policy.lambda_dynamodb
  ]

  tags = {
    Name = "${var.project_name}-api-function"
  }
}

# Output Lambda function details
output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.api.arn
}
