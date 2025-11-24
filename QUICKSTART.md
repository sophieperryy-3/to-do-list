# Quick Start Guide

Get the DevOps To-Do List application running in 15 minutes.

## ⚡ Prerequisites

- [ ] AWS Account
- [ ] Node.js 18+ installed
- [ ] AWS CLI installed and configured
- [ ] Terraform 1.5+ installed

## 🚀 5-Step Deployment

### Step 1: Clone and Install (2 minutes)

```bash
# Clone repository
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

### Step 2: Configure AWS (1 minute)

```bash
# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Format (json)

# Verify
aws sts get-caller-identity
```

### Step 3: Build Backend (1 minute)

```bash
cd backend
npm run build
cd ..
```

### Step 4: Deploy Infrastructure (5 minutes)

```bash
cd infrastructure

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars - CHANGE frontend_bucket_name to be unique!

# Deploy
terraform init
terraform apply
# Type 'yes' when prompted

# Save outputs
terraform output > outputs.txt
```

### Step 5: Deploy Frontend (3 minutes)

```bash
cd ../frontend

# Get API URL from Terraform
API_URL=$(cd ../infrastructure && terraform output -raw api_endpoint)
echo "VITE_API_URL=$API_URL" > .env.production

# Build and deploy
npm run build

# Upload to S3
BUCKET=$(cd ../infrastructure && terraform output -raw frontend_bucket_name)
aws s3 sync dist/ s3://$BUCKET/ --delete

# Invalidate CloudFront cache
CLOUDFRONT_ID=$(cd ../infrastructure && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
```

### Step 6: Test! (1 minute)

```bash
# Get URLs
cd infrastructure
terraform output frontend_url
terraform output api_endpoint

# Test API
curl $(terraform output -raw api_endpoint)/health

# Open frontend URL in browser
```

## ✅ Verification

Your app is working if:
- [ ] Frontend loads in browser
- [ ] You can add a task
- [ ] You can mark task complete
- [ ] You can delete a task
- [ ] Tasks persist after refresh

## 🔧 Local Development (Optional)

Run locally without AWS:

```bash
# Terminal 1: Backend
cd backend
cp .env.example .env
# Edit .env with your AWS credentials
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## 🔄 Setup GitHub Actions (Optional)

For automated CI/CD:

1. Push code to GitHub
2. Go to: Settings → Secrets and variables → Actions
3. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
4. Push to main branch
5. Watch GitHub Actions deploy automatically!

## 🗑️ Cleanup

When done:

```bash
cd infrastructure
terraform destroy
# Type 'yes' to delete everything
```

## 🐛 Troubleshooting

### Error: S3 bucket already exists
**Fix**: Change `frontend_bucket_name` in `terraform.tfvars`

### Error: Lambda deployment package not found
**Fix**: Build backend first: `cd backend && npm run build`

### Error: Frontend shows API errors
**Fix**: Check `VITE_API_URL` matches Terraform output

### Error: CloudFront shows old content
**Fix**: Invalidate cache:
```bash
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## 📚 Next Steps

- Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions
- Read [DEMO_CHECKLIST.md](DEMO_CHECKLIST.md) for demo preparation
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for architecture details

## 🎯 For Your Demo

1. Deploy the app (follow steps above)
2. Test it works
3. Take screenshots (backup for demo)
4. Practice your 20-minute presentation
5. Review [DEMO_CHECKLIST.md](DEMO_CHECKLIST.md)

Good luck! 🚀
