# Complete Deployment Guide

This guide walks you through deploying the DevOps To-Do List application from scratch.

## 📋 Prerequisites Checklist

- [ ] AWS Account with admin access
- [ ] GitHub account
- [ ] Node.js 18+ installed
- [ ] AWS CLI installed and configured
- [ ] Terraform 1.5+ installed
- [ ] Git installed

## 🚀 Step-by-Step Deployment

### Step 1: Clone and Setup Repository

```bash
# Clone your repository
git clone <your-repo-url>
cd devops-todo-app

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Enter when prompted:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)

# Verify configuration
aws sts get-caller-identity
```

### Step 3: Build Backend

```bash
cd backend
npm run build
cd ..
```

This creates `backend/dist/` with compiled JavaScript.

### Step 4: Configure Terraform Variables

```bash
cd infrastructure

# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars
# IMPORTANT: Change frontend_bucket_name to ensure uniqueness!
nano terraform.tfvars
```

Example `terraform.tfvars`:
```hcl
aws_region           = "us-east-1"
environment          = "prod"
project_name         = "todo-app"
dynamodb_table_name  = "todo-tasks"
lambda_function_name = "todo-api-function"
frontend_bucket_name = "todo-app-frontend-12345"  # Change this!
```

### Step 5: Deploy Infrastructure with Terraform

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply
# Type 'yes' when prompted

# Save outputs
terraform output > ../terraform-outputs.txt
```

**Important**: Save these outputs:
- `api_endpoint` - You'll need this for frontend
- `frontend_bucket_name` - For frontend deployment
- `cloudfront_distribution_id` - For cache invalidation

### Step 6: Configure Frontend with API URL

```bash
cd ../frontend

# Get API endpoint from Terraform output
API_URL=$(cd ../infrastructure && terraform output -raw api_endpoint)

# Create production environment file
echo "VITE_API_URL=$API_URL" > .env.production

# Verify
cat .env.production
```

### Step 7: Build and Deploy Frontend

```bash
# Build frontend
npm run build

# Get S3 bucket name from Terraform
BUCKET_NAME=$(cd ../infrastructure && terraform output -raw frontend_bucket_name)

# Deploy to S3
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Get CloudFront distribution ID
CLOUDFRONT_ID=$(cd ../infrastructure && terraform output -raw cloudfront_distribution_id)

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"
```

### Step 8: Test the Deployment

```bash
# Get URLs
cd ../infrastructure
terraform output frontend_url
terraform output api_endpoint

# Test API health
curl $(terraform output -raw api_endpoint)/health

# Test tasks endpoint
curl $(terraform output -raw api_endpoint)/tasks
```

Open the frontend URL in your browser!

### Step 9: Setup GitHub Actions (CI/CD)

```bash
# In your GitHub repository, go to:
# Settings → Secrets and variables → Actions → New repository secret

# Add these secrets:
# - AWS_ACCESS_KEY_ID: Your AWS access key
# - AWS_SECRET_ACCESS_KEY: Your AWS secret key
# - AWS_REGION: us-east-1 (or your region)
```

### Step 10: Push to GitHub

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions will automatically:
1. Run CI checks (lint, test, security)
2. Deploy infrastructure (Terraform)
3. Deploy backend (Lambda)
4. Deploy frontend (S3 + CloudFront)
5. Run smoke tests

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Frontend loads in browser
- [ ] Can add a task
- [ ] Can mark task as complete
- [ ] Can delete a task
- [ ] Tasks persist after page refresh
- [ ] API health endpoint returns 200
- [ ] CloudWatch logs show requests
- [ ] GitHub Actions CI passes
- [ ] GitHub Actions deploy passes

## 📊 Viewing Logs

### CloudWatch Logs (Lambda)

```bash
# Tail Lambda logs
aws logs tail /aws/lambda/todo-api-function --follow

# Filter errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/todo-api-function \
  --filter-pattern '{ $.level = "error" }'
```

### CloudWatch Logs (API Gateway)

```bash
# Tail API Gateway logs
aws logs tail /aws/apigateway/todo-app --follow
```

## 🔄 Making Updates

### Update Backend Code

```bash
cd backend

# Make changes to src/

# Build
npm run build

# Update Lambda
cd dist
zip -r ../lambda-deployment.zip .
cd ..
zip -r lambda-deployment.zip node_modules

aws lambda update-function-code \
  --function-name todo-api-function \
  --zip-file fileb://lambda-deployment.zip

# Or just push to main and let GitHub Actions deploy
```

### Update Frontend Code

```bash
cd frontend

# Make changes to src/

# Build
npm run build

# Deploy
BUCKET_NAME=$(cd ../infrastructure && terraform output -raw frontend_bucket_name)
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Invalidate cache
CLOUDFRONT_ID=$(cd ../infrastructure && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"

# Or just push to main and let GitHub Actions deploy
```

### Update Infrastructure

```bash
cd infrastructure

# Make changes to *.tf files

# Plan changes
terraform plan

# Apply changes
terraform apply
```

## 🗑️ Cleanup (Delete Everything)

When you're done with the demo:

```bash
cd infrastructure

# Destroy all resources
terraform destroy
# Type 'yes' when prompted
```

**Warning**: This permanently deletes:
- All tasks in DynamoDB
- Lambda function
- S3 bucket and frontend files
- CloudFront distribution
- All logs

## 🐛 Troubleshooting

### Issue: S3 bucket name already exists
**Solution**: Change `frontend_bucket_name` in `terraform.tfvars` to a unique value.

### Issue: Lambda function not found
**Solution**: Ensure backend is built before running Terraform:
```bash
cd backend
npm run build
cd ../infrastructure
terraform apply
```

### Issue: Frontend shows API errors
**Solution**: Check that `VITE_API_URL` in `.env.production` matches Terraform output:
```bash
cd infrastructure
terraform output api_endpoint
cd ../frontend
cat .env.production
```

### Issue: CORS errors in browser
**Solution**: Verify API Gateway CORS configuration in `infrastructure/api-gateway.tf`.

### Issue: CloudFront shows old content
**Solution**: Invalidate cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id <your-distribution-id> \
  --paths "/*"
```

### Issue: GitHub Actions fails with AWS credentials
**Solution**: Verify secrets are set correctly in GitHub:
- Settings → Secrets and variables → Actions
- Check AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

## 📚 Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

## 🎯 Demo Script (20 minutes)

### Minutes 0-3: Introduction
- Explain the application (To-Do List)
- Show architecture diagram (draw on whiteboard or show README)
- Explain DevOps focus vs. application features

### Minutes 3-6: User Stories
- Open `docs/user-and-devops-stories.md`
- Walk through 2-3 user stories
- Walk through 3-4 DevOps stories
- Explain how stories map to implementation

### Minutes 6-9: Code Walkthrough
- Show backend structure (`backend/src/`)
- Highlight structured logging (`utils/logger.ts`)
- Show frontend structure (`frontend/src/`)
- Explain API client and error handling

### Minutes 9-12: Infrastructure as Code
- Open `infrastructure/main.tf`
- Walk through key resources (DynamoDB, Lambda, API Gateway, S3, CloudFront)
- Explain IAM roles and least privilege
- Show Terraform outputs

### Minutes 12-15: CI/CD Pipeline
- Open `.github/workflows/ci.yml`
- Explain CI stages (lint, test, security)
- Open `.github/workflows/deploy.yml`
- Explain CD stages (infrastructure, backend, frontend)
- Show GitHub Actions runs (live or screenshots)

### Minutes 15-17: DevSecOps
- Point out security scans in CI (npm audit, CodeQL)
- Explain shift-left security
- Show CloudWatch logs with request tracing
- Discuss how logs could trigger alerts

### Minutes 17-19: Live Demo
- Open the live application
- Add a task
- Mark it complete
- Delete it
- Refresh page (show persistence)
- Show CloudWatch logs for the requests

### Minutes 19-20: Conclusion
- Summarize DevOps practices demonstrated
- Mention AWS source control limitation and solution
- Q&A

## ✅ Success Criteria

Your deployment is successful if:

1. ✅ All infrastructure provisioned via Terraform
2. ✅ Backend API responds to requests
3. ✅ Frontend loads and functions correctly
4. ✅ Tasks persist in DynamoDB
5. ✅ CI pipeline passes (lint, test, security)
6. ✅ CD pipeline deploys automatically on push to main
7. ✅ Logs visible in CloudWatch
8. ✅ All documentation is clear and complete

Good luck with your demo! 🚀
