# GET STARTED NOW - Step-by-Step

Follow these exact steps to get your project on GitHub and deployed to AWS.

## 🚀 Part 1: Push to GitHub (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `devops-todo-app` (or your choice)
3. Description: "DevOps To-Do List with CI/CD, IaC, and DevSecOps"
4. Choose: **Public** (so you can use GitHub Actions for free)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Initialize Git and Push

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: DevOps To-Do List application"

# Add your GitHub repository as remote (REPLACE with your URL)
git remote add origin https://github.com/YOUR-USERNAME/devops-todo-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

### Step 3: Verify on GitHub

1. Refresh your GitHub repository page
2. You should see all files uploaded
3. Check that `.github/workflows/` folder exists with `ci.yml` and `deploy.yml`

---

## ☁️ Part 2: Setup AWS (10 minutes)

### Step 1: Install AWS CLI (if not already installed)

**macOS:**
```bash
brew install awscli
```

**Or download from:** https://aws.amazon.com/cli/

### Step 2: Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Get from AWS Console → IAM → Users → Security credentials
- **AWS Secret Access Key**: Get from same place
- **Default region**: Enter `us-east-1`
- **Default output format**: Enter `json`

### Step 3: Verify AWS Access

```bash
aws sts get-caller-identity
```

You should see your AWS account ID and user info.

---

## 🔐 Part 3: Setup GitHub Secrets (3 minutes)

GitHub Actions needs AWS credentials to deploy.

### Step 1: Get Your AWS Credentials

You already have these from the previous step:
- AWS Access Key ID
- AWS Secret Access Key

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

Add these three secrets:

**Secret 1:**
- Name: `AWS_ACCESS_KEY_ID`
- Value: Your AWS access key ID
- Click "Add secret"

**Secret 2:**
- Name: `AWS_SECRET_ACCESS_KEY`
- Value: Your AWS secret access key
- Click "Add secret"

**Secret 3:**
- Name: `AWS_REGION`
- Value: `us-east-1`
- Click "Add secret"

---

## 📦 Part 4: Install Dependencies (5 minutes)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

Wait for installation to complete (may take 2-3 minutes).

### Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

Wait for installation to complete.

### Step 3: Return to Root

```bash
cd ..
```

---

## 🏗️ Part 5: Deploy Infrastructure (10 minutes)

### Step 1: Build Backend

```bash
cd backend
npm run build
cd ..
```

You should see a `backend/dist/` folder created.

### Step 2: Configure Terraform Variables

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
```

Now edit `terraform.tfvars`:

```bash
# Open in your editor
open terraform.tfvars
# or
nano terraform.tfvars
```

**IMPORTANT:** Change this line:
```hcl
frontend_bucket_name = "todo-app-frontend-YOUR-UNIQUE-ID"
```

Replace `YOUR-UNIQUE-ID` with something unique, like:
```hcl
frontend_bucket_name = "todo-app-frontend-john-12345"
```

Save and close the file.

### Step 3: Initialize Terraform

```bash
terraform init
```

This downloads AWS provider plugins (takes 1-2 minutes).

### Step 4: Deploy Infrastructure

```bash
terraform plan
```

Review what will be created. Then:

```bash
terraform apply
```

Type `yes` when prompted.

**This takes 5-8 minutes.** Terraform is creating:
- DynamoDB table
- Lambda function
- API Gateway
- S3 bucket
- CloudFront distribution
- IAM roles
- CloudWatch log groups

### Step 5: Save Outputs

After successful deployment:

```bash
terraform output
```

**SAVE THESE VALUES!** You'll need them. Copy them to a text file:

```bash
terraform output > ../deployment-outputs.txt
```

---

## 🎨 Part 6: Deploy Frontend (5 minutes)

### Step 1: Get API URL

```bash
# Still in infrastructure/ directory
API_URL=$(terraform output -raw api_endpoint)
echo $API_URL
```

### Step 2: Configure Frontend

```bash
cd ../frontend
echo "VITE_API_URL=$API_URL" > .env.production
cat .env.production
```

Verify it shows: `VITE_API_URL=https://...`

### Step 3: Build Frontend

```bash
npm run build
```

This creates `frontend/dist/` with your built app.

### Step 4: Deploy to S3

```bash
# Get bucket name
BUCKET_NAME=$(cd ../infrastructure && terraform output -raw frontend_bucket_name)
echo "Deploying to bucket: $BUCKET_NAME"

# Upload files
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
```

### Step 5: Invalidate CloudFront Cache

```bash
# Get CloudFront distribution ID
CLOUDFRONT_ID=$(cd ../infrastructure && terraform output -raw cloudfront_distribution_id)
echo "Invalidating CloudFront: $CLOUDFRONT_ID"

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"
```

---

## 🎉 Part 7: Test Your Application! (2 minutes)

### Step 1: Get Your URLs

```bash
cd ../infrastructure
echo "Frontend URL:"
terraform output frontend_url
echo ""
echo "API URL:"
terraform output api_endpoint
```

### Step 2: Test API

```bash
# Test health endpoint
curl $(terraform output -raw api_endpoint)/health
```

You should see: `{"status":"healthy",...}`

### Step 3: Open Frontend

Copy the frontend URL and open it in your browser!

**Try:**
1. Add a task
2. Mark it complete
3. Delete it
4. Refresh page (tasks should persist!)

---

## 🔄 Part 8: Enable Automatic Deployments (Already Done!)

Your CI/CD pipeline is already set up! Here's what happens now:

### Every time you push code:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

**GitHub Actions automatically:**
1. Runs CI checks (lint, test, security)
2. Deploys infrastructure (Terraform)
3. Deploys backend (Lambda)
4. Deploys frontend (S3 + CloudFront)
5. Runs smoke tests

### Watch it happen:

1. Go to your GitHub repository
2. Click **Actions** tab
3. You'll see workflows running!

---

## ✅ Verification Checklist

Check that everything works:

- [ ] GitHub repository created and code pushed
- [ ] GitHub Secrets added (AWS credentials)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Terraform infrastructure deployed
- [ ] Frontend deployed to S3
- [ ] CloudFront cache invalidated
- [ ] API health check returns 200
- [ ] Frontend loads in browser
- [ ] Can add a task
- [ ] Can mark task complete
- [ ] Can delete a task
- [ ] Tasks persist after refresh
- [ ] GitHub Actions CI workflow exists
- [ ] GitHub Actions Deploy workflow exists

---

## 🐛 Troubleshooting

### Problem: "S3 bucket already exists"

**Solution:** Edit `infrastructure/terraform.tfvars` and change `frontend_bucket_name` to something more unique.

```bash
cd infrastructure
nano terraform.tfvars
# Change the bucket name
terraform apply
```

### Problem: "Lambda deployment package not found"

**Solution:** Build the backend first:

```bash
cd backend
npm run build
cd ../infrastructure
terraform apply
```

### Problem: Frontend shows "Failed to fetch"

**Solution:** Check that API URL is correct:

```bash
cd frontend
cat .env.production
# Should show: VITE_API_URL=https://...

# If wrong, fix it:
cd ../infrastructure
echo "VITE_API_URL=$(terraform output -raw api_endpoint)" > ../frontend/.env.production
cd ../frontend
npm run build
aws s3 sync dist/ s3://$(cd ../infrastructure && terraform output -raw frontend_bucket_name)/ --delete
```

### Problem: GitHub Actions fails with AWS credentials

**Solution:** Verify secrets are set correctly:

1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Verify these exist:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`

### Problem: CloudFront shows old content

**Solution:** Invalidate cache:

```bash
cd infrastructure
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

Wait 2-3 minutes for invalidation to complete.

---

## 📊 View Logs

### CloudWatch Logs (Lambda)

```bash
aws logs tail /aws/lambda/todo-api-function --follow
```

Press Ctrl+C to stop.

### GitHub Actions Logs

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on a workflow run
4. Click on a job to see logs

---

## 🎯 What to Do Next

### For Your Demo:

1. **Test everything works** - Add/complete/delete tasks
2. **Take screenshots** - Working app, GitHub Actions, CloudWatch logs
3. **Read DEMO_CHECKLIST.md** - Prepare your 20-minute presentation
4. **Practice timing** - Aim for 18 minutes

### To Make Changes:

```bash
# Make your changes to code
git add .
git commit -m "Description of changes"
git push origin main

# GitHub Actions will automatically deploy!
```

### To View Your Deployment:

- **Frontend**: Check `terraform output frontend_url`
- **API**: Check `terraform output api_endpoint`
- **Logs**: `aws logs tail /aws/lambda/todo-api-function --follow`
- **GitHub Actions**: Repository → Actions tab

---

## 🗑️ Cleanup (After Demo)

When you're done and want to delete everything:

```bash
cd infrastructure
terraform destroy
# Type 'yes' to confirm

# This deletes:
# - All AWS resources
# - All data in DynamoDB
# - All logs
# - Everything!
```

**Warning:** This is permanent and cannot be undone!

---

## 🎉 Success!

You now have:
- ✅ Code on GitHub
- ✅ CI/CD pipeline running
- ✅ Infrastructure deployed to AWS
- ✅ Working application
- ✅ Automatic deployments on push

**Your application is live!** 🚀

Open your frontend URL and start using it!

---

## 📞 Quick Reference Commands

```bash
# View frontend URL
cd infrastructure && terraform output frontend_url

# View API URL
cd infrastructure && terraform output api_endpoint

# Test API
curl $(cd infrastructure && terraform output -raw api_endpoint)/health

# View logs
aws logs tail /aws/lambda/todo-api-function --follow

# Redeploy frontend
cd frontend
npm run build
aws s3 sync dist/ s3://$(cd ../infrastructure && terraform output -raw frontend_bucket_name)/ --delete
aws cloudfront create-invalidation --distribution-id $(cd ../infrastructure && terraform output -raw cloudfront_distribution_id) --paths "/*"

# Destroy everything
cd infrastructure && terraform destroy
```

---

**Need help?** Check:
- `DEPLOYMENT_GUIDE.md` for detailed explanations
- `QUICKSTART.md` for condensed version
- `DEMO_CHECKLIST.md` for demo preparation

Good luck! 🚀
