# Terraform Remote Backend Configuration
# This configures remote state storage in S3 with DynamoDB locking
# 
# IMPORTANT: This backend configuration should only be enabled AFTER
# the backend infrastructure (S3 bucket + DynamoDB table) has been created
# using the resources in backend-setup.tf

terraform {
  backend "s3" {
    bucket         = "terraform-state-sophie-devops-98633"
    key            = "state/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}