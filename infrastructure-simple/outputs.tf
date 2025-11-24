# Outputs

output "summary" {
  description = "Deployment summary"
  value = {
    dynamodb_table = aws_dynamodb_table.tasks.name
    frontend_bucket = aws_s3_bucket.frontend.id
    frontend_url = "http://${aws_s3_bucket.frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com"
    region = var.aws_region
  }
}

output "next_steps" {
  value = <<-EOT
    
    ✅ Infrastructure deployed!
    
    📝 IMPORTANT: For AWS Academy, you'll need to run the backend locally
    (Lambda requires IAM roles which AWS Academy restricts)
    
    Next steps:
    
    1. Deploy frontend:
       cd ../frontend
       echo "VITE_API_URL=http://localhost:3000" > .env.production
       npm run build
       aws s3 sync dist/ s3://${aws_s3_bucket.frontend.id}/ --delete
    
    2. Run backend locally:
       cd ../backend
       export DYNAMODB_TABLE_NAME=${aws_dynamodb_table.tasks.name}
       export AWS_REGION=${var.aws_region}
       npm run dev
    
    3. Open frontend:
       http://${aws_s3_bucket.frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com
    
  EOT
}
