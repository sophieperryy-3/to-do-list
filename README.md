# DevOps To-Do List Application

A production-grade To-Do List application demonstrating modern DevOps practices, CI/CD pipelines, Infrastructure as Code, and DevSecOps integration.

🚀 **Live Demo**: [View Application](https://d18rau9nxg1ucb.cloudfront.net)

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React + TypeScript (Vite) → Deployed to S3 + CloudFront
- **Backend**: Node.js + Express + TypeScript → Deployed to AWS Lambda + API Gateway
- **Database**: AWS DynamoDB (serverless, fully managed)
- **IaC**: Terraform for infrastructure provisioning
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Source Control**: GitHub (AWS has no native source control)

### Why This Architecture?

**Serverless Backend (Lambda + API Gateway)**:
- Auto-scaling without manual intervention
- Pay-per-request pricing (cost-effective for demos)
- No server management overhead
- Built-in high availability

**DynamoDB**:
- Serverless database (no provisioning)
- Single-digit millisecond latency
- Automatic scaling
- Perfect for key-value task storage

**S3 + CloudFront for Frontend**:
- Static site hosting with global CDN
- HTTPS by default
- Low latency worldwide
- Cost-effective

## 🚀 DevOps Pipeline Flow

```
Developer Push → GitHub
    ↓
CI Pipeline (GitHub Actions)
    ├─ Checkout code
    ├─ Install dependencies
    ├─ Lint (ESLint + TypeScript)
    ├─ Unit Tests (Jest)
    ├─ Security Scan (npm audit + CodeQL)
    └─ Build artifacts
    ↓
CD Pipeline (on main branch)
    ├─ Terraform Plan
    ├─ Terraform Apply (provision infrastructure)
    ├─ Deploy Backend (Lambda)
    ├─ Deploy Frontend (S3 + CloudFront)
    └─ Smoke Tests
    ↓
Production Environment (AWS)
```

## 📋 AWS Source Control Limitation

**The Challenge**: AWS does not provide native source control services (like GitHub or GitLab).

**Our Solution**:
- Use **GitHub** as the single source of truth for all code
- AWS is purely a **deployment target** and runtime environment
- GitHub Actions orchestrates deployments to AWS using AWS credentials

**Advantages**:
- ✅ Industry-standard Git workflows (PRs, code review, branching)
- ✅ Rich ecosystem of CI/CD tools and integrations
- ✅ Separation of concerns (code vs. infrastructure)
- ✅ Vendor flexibility (can switch cloud providers without changing source control)

**Disadvantages**:
- ❌ Need to manage AWS credentials in GitHub Secrets
- ❌ Two separate platforms to monitor (GitHub + AWS Console)
- ❌ Network dependency (GitHub must reach AWS APIs)

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured with credentials
- Terraform 1.5+

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Run Locally

**Backend** (with local DynamoDB simulation):
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

**Frontend**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 3. Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 4. Run Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## ☁️ Infrastructure Deployment

### Setup AWS Credentials

```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_REGION="us-east-1"
```

### Deploy Infrastructure

```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

Terraform will output:
- `api_endpoint` - Backend API URL
- `frontend_url` - CloudFront distribution URL
- `dynamodb_table_name` - DynamoDB table name

### Configure Frontend with API URL

After Terraform deployment, update frontend environment:

```bash
cd frontend
echo "VITE_API_URL=<api_endpoint_from_terraform>" > .env.production
npm run build
```

## 🔄 CI/CD Pipeline (GitHub Actions)

### Required GitHub Secrets

Navigate to: `Settings → Secrets and variables → Actions`

Add these secrets:
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - e.g., `us-east-1`

### Workflows

**1. CI Pipeline** (`.github/workflows/ci.yml`)
- Triggers on: Every push and pull request
- Runs: Lint, test, security scans
- Purpose: Continuous Integration - catch issues early

**2. Deploy Pipeline** (`.github/workflows/deploy.yml`)
- Triggers on: Push to `main` branch
- Runs: Full CI checks + infrastructure deployment + application deployment
- Purpose: Continuous Delivery/Deployment to production

### Triggering Deployments

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# GitHub Actions automatically:
# 1. Runs CI checks
# 2. Deploys infrastructure (if changed)
# 3. Deploys application
# 4. Updates CloudFront
```

## 📊 Observability & Logging

All backend logs are automatically sent to **AWS CloudWatch Logs**.

**Log Structure**:
- JSON formatted logs
- Request ID for tracing
- Timestamp, level, message
- Error stack traces when applicable

**Viewing Logs**:
```bash
aws logs tail /aws/lambda/todo-api-function --follow
```

See `docs/logging-and-observability.md` for detailed monitoring setup.

## 🔒 DevSecOps Integration

Security is integrated throughout the pipeline:

1. **Dependency Scanning**: `npm audit` on every build
2. **Static Analysis**: CodeQL scans for vulnerabilities
3. **Least Privilege IAM**: Terraform creates minimal IAM roles
4. **Secrets Management**: No secrets in code, only environment variables
5. **HTTPS Everywhere**: CloudFront enforces HTTPS

## 📁 Repository Structure

```
.
├── frontend/              # React + TypeScript frontend
├── backend/               # Express + TypeScript API
├── infrastructure/        # Terraform IaC
├── .github/workflows/     # CI/CD pipelines
├── docs/                  # Documentation
└── README.md             # This file
```

## 🎯 Demo Checklist

For your 20-minute demo, showcase:

1. ✅ **User Stories** - Show `docs/user-and-devops-stories.md`
2. ✅ **Code Quality** - Run `npm run lint` and `npm test` locally
3. ✅ **CI Pipeline** - Show GitHub Actions CI workflow logs
4. ✅ **Security Scans** - Point out npm audit and CodeQL results
5. ✅ **IaC** - Walk through `infrastructure/main.tf`
6. ✅ **Deployment** - Show deploy workflow and AWS resources
7. ✅ **Live App** - Demo the working application
8. ✅ **Logs** - Show CloudWatch logs with request tracing
9. ✅ **Compliance Evidence** - Show pipeline artifacts and test reports

## 📚 Additional Documentation

- `docs/user-and-devops-stories.md` - User and DevOps stories
- `docs/logging-and-observability.md` - Monitoring and alerting setup
- `infrastructure/README.md` - Infrastructure deployment guide

## 🤝 Contributing

This is a demo project for educational purposes. The focus is on DevOps practices, not application features.

## 📄 License

MIT License - Educational use
