# Terraform Configuration for DevOps To-Do List Application
# 
# This IaC provisions:
# - DynamoDB table for task storage
# - Lambda function for backend API
# - API Gateway for HTTP endpoints
# - S3 bucket for frontend hosting
# - CloudFront distribution for CDN
# - IAM roles and policies (least privilege)

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }

  # Uncomment for remote state (recommended for team environments)
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "todo-app/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "DevOps-ToDo"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data source for current AWS account
data "aws_caller_identity" "current" {}
