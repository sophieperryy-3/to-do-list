# Lambda Function for Backend API

# Create IAM role for Lambda (real AWS account)
resource "aws_iam_role" "lambda_role" {
  name = "todo-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Policy for DynamoDB access
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "lambda-dynamodb-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
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
    }]
  })
}

# S3 bucket for Lambda code
resource "aws_s3_bucket" "lambda_code" {
  bucket = "todo-lambda-code-${data.aws_caller_identity.current.account_id}"
}

# Upload Lambda zip to S3
resource "aws_s3_object" "lambda_zip" {
  bucket = aws_s3_bucket.lambda_code.id
  key    = "lambda-deployment.zip"
  source = "${path.module}/lambda-deployment.zip"

  # Use a placeholder etag for CI validation when file doesn't exist
  etag = fileexists("${path.module}/lambda-deployment.zip") ? filemd5("${path.module}/lambda-deployment.zip") : "placeholder-for-ci-validation"
}

# Lambda function
resource "aws_lambda_function" "api" {
  s3_bucket        = aws_s3_bucket.lambda_code.id
  s3_key           = aws_s3_object.lambda_zip.key
  function_name    = "todo-api"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda.handler"
  source_code_hash = filebase64sha256("${path.module}/lambda-deployment.zip")
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.tasks.name
      NODE_ENV            = "production"
    }
  }
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
