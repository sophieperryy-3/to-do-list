# 🚀 START HERE - Get Your App Live in 30 Minutes

## Option 1: Automated Setup (Recommended)

Run the setup script that does everything for you:

```bash
./setup.sh
```

This script will:
1. ✅ Initialize git and push to GitHub
2. ✅ Check AWS CLI is configured
3. ✅ Install all dependencies
4. ✅ Build backend
5. ✅ Deploy infrastructure with Terraform
6. ✅ Deploy frontend to S3
7. ✅ Give you your live URLs!

**Just follow the prompts!**

---

## Option 2: Manual Step-by-Step

If you prefer to do it manually, follow these exact commands:

### 1. Push to GitHub (2 minutes)

First, create a repository on GitHub:
- Go to https://github.com/new
- Name: `devops-todo-app`
- Make it **PUBLIC**
- **Don't** initialize with README
- Click "Create repository"

Then run (replace YOUR-USERNAME):

```bash
git init
git add .
git commit -m "Initial commit: DevOps To-Do List"
git remote add origin https://github.com/YOUR-USERNAME/devops-todo-app.git
git branch -M main
git push -u origin main
```

### 2. Configure AWS (1 minute)

```bash
aws configure
```

Enter:
- AWS Access Key ID: (from AWS Console)
- AWS Secret Access Key: (from AWS Console)
- Region: `us-east-1`
- Format: `json`

### 3. Install Dependencies (5 minutes)

```bash
# Backend
cd backend
npm install
npm run build
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 4. Deploy Infrastructure (10 minutes)

```bash
cd infrastructure

# Configure variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
# Change: frontend_bucket_name = "todo-app-frontend-YOUR-NAME-12345"
# Save and exit (Ctrl+X, Y, Enter)

# Deploy
terraform init
terraform apply
# Type: yes
```

**Wait 5-8 minutes for deployment...**

### 5. Deploy Frontend (3 minutes)

```bash
# Get API URL
API_URL=$(terraform output -raw api_endpoint)

# Configure frontend
cd ../frontend
echo "VITE_API_URL=$API_URL" > .env.production

# Build and deploy
npm run build
aws s3 sync dist/ s3://$(cd ../infrastructure && terraform output -raw frontend_bucket_name)/ --delete

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id $(cd ../infrastructure && terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

### 6. Get Your URLs

```bash
cd ../infrastructure
echo "Frontend URL:"
terraform output frontend_url
echo "API URL:"
terraform output api_endpoint
```

**Open the frontend URL in your browser!**

---

## 🔐 Setup GitHub Actions (for CI/CD)

After deployment, enable automatic deployments:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these three secrets:

   **Secret 1:**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: Your AWS access key

   **Secret 2:**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: Your AWS secret key

   **Secret 3:**
   - Name: `AWS_REGION`
   - Value: `us-east-1`

Now every push to `main` will automatically deploy! 🎉

---

## ✅ Test Your App

1. Open the frontend URL
2. Add a task: "Test my DevOps app"
3. Mark it complete ✓
4. Delete it
5. Refresh page (tasks should persist!)

---

## 📊 View Logs

```bash
aws logs tail /aws/lambda/todo-api-function --follow
```

---

## 🎯 Next Steps

1. ✅ Test the application works
2. ✅ Setup GitHub Secrets (for CI/CD)
3. ✅ Read `DEMO_CHECKLIST.md` for your presentation
4. ✅ Take screenshots (backup for demo)
5. ✅ Practice your 20-minute demo

---

## 🐛 Common Issues

### "S3 bucket already exists"
Edit `infrastructure/terraform.tfvars` and change the bucket name to something more unique.

### "AWS credentials not found"
Run `aws configure` and enter your credentials.

### Frontend shows errors
Check that `frontend/.env.production` has the correct API URL:
```bash
cat frontend/.env.production
```

### CloudFront shows old content
Wait 2-3 minutes for cache invalidation, or run:
```bash
cd infrastructure
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

---

## 🗑️ Cleanup (After Demo)

To delete everything:

```bash
cd infrastructure
terraform destroy
# Type: yes
```

---

## 📚 More Help

- **Quick deployment**: See `GET_STARTED_NOW.md`
- **Detailed guide**: See `DEPLOYMENT_GUIDE.md`
- **Demo prep**: See `DEMO_CHECKLIST.md`
- **Architecture**: See `ARCHITECTURE.md`

---

## 🎉 You're Ready!

Choose Option 1 (automated) or Option 2 (manual) and get started!

Your application will be live in about 30 minutes. 🚀
