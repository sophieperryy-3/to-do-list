# Lambda Function for Backend API

# Use existing LabRole (AWS Academy provides this)
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

# Lambda function
resource "aws_lambda_function" "api" {
  filename         = "${path.module}/lambda-deployment.zip"
  function_name    = "todo-api"
  role            = data.aws_iam_role.lab_role.arn
  handler         = "lambda.handler"
  source_code_hash = filebase64sha256("${path.module}/lambda-deployment.zip")
  runtime         = "nodejs20.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.tasks.name
      AWS_REGION         = var.aws_region
      NODE_ENV           = "production"
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
