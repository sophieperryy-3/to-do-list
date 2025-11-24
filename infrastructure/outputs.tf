# Consolidated Outputs
#
# All important values needed for deployment and configuration

output "summary" {
  description = "Deployment summary"
  value = {
    api_endpoint           = aws_apigatewayv2_api.http_api.api_endpoint
    frontend_url           = "https://${aws_cloudfront_distribution.frontend.domain_name}"
    dynamodb_table         = aws_dynamodb_table.tasks.name
    lambda_function        = aws_lambda_function.api.function_name
    s3_bucket              = aws_s3_bucket.frontend.id
    cloudfront_distribution = aws_cloudfront_distribution.frontend.id
    region                 = var.aws_region
  }
}

# Instructions for next steps
output "next_steps" {
  description = "Next steps after infrastructure deployment"
  value = <<-EOT
    
    ✅ Infrastructure deployed successfully!
    
    Next steps:
    
    1. Configure frontend with API URL:
       cd frontend
       echo "VITE_API_URL=${aws_apigatewayv2_api.http_api.api_endpoint}" > .env.production
    
    2. Build and deploy frontend:
       npm run build
       aws s3 sync dist/ s3://${aws_s3_bucket.frontend.id}/ --delete
       aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.frontend.id} --paths "/*"
    
    3. Test the application:
       Frontend: https://${aws_cloudfront_distribution.frontend.domain_name}
       API: ${aws_apigatewayv2_api.http_api.api_endpoint}/health
    
    4. View logs:
       aws logs tail /aws/lambda/${aws_lambda_function.api.function_name} --follow
    
  EOT
}
