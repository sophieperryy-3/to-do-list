# Outputs

output "summary" {
  description = "Deployment summary"
  value = {
    dynamodb_table  = aws_dynamodb_table.tasks.name
    frontend_bucket = aws_s3_bucket.frontend.id
    frontend_url    = "http://${aws_s3_bucket.frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com"
    api_url         = aws_apigatewayv2_api.api.api_endpoint
    region          = var.aws_region
  }
}

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "next_steps" {
  value = <<-EOT
    
    ✅ Infrastructure deployed!
    
    API Endpoint: ${aws_apigatewayv2_api.api.api_endpoint}
    Frontend URL: http://${aws_s3_bucket.frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com
    
    Next steps:
    
    1. Package and deploy backend Lambda:
       cd ../backend
       npm run build
       cd dist && zip -r ../lambda-deployment.zip . && cd ..
       cd node_modules && zip -r ../lambda-deployment.zip . && cd ..
       aws lambda update-function-code --function-name todo-api --zip-file fileb://lambda-deployment.zip
    
    2. Update frontend with API URL and deploy:
       cd ../frontend
       echo "VITE_API_URL=${aws_apigatewayv2_api.api.api_endpoint}" > .env.production
       npm run build
       aws s3 sync dist/ s3://${aws_s3_bucket.frontend.id}/ --delete
    
    3. Test the API:
       curl ${aws_apigatewayv2_api.api.api_endpoint}/tasks
    
  EOT
}
