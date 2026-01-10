# Simplified Terraform for AWS Academy/Learner Lab
# Works with restricted permissions
# Updated to test Terraform CI pipeline on staging branch

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote backend for team collaboration and state locking
  backend "s3" {
    bucket         = "terraform-state-sophie-devops-98633"
    key            = "todo-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}
