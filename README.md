# DevOps Task Manager - Production CI/CD Pipeline

A production-grade task management application demonstrating enterprise DevOps practices including automated CI/CD pipelines, Infrastructure as Code, real-time monitoring, and secure cloud deployment.

🚀 **Live Demo**: [View Application](https://d18rau9nxg1ucb.cloudfront.net) (HTTPS enabled via CloudFront)

## 🎯 Key Features

✅ **Outstanding-Level CI/CD** - Hard quality gates, security scanning, DORA metrics  
✅ **Infrastructure Security** - Terraform validation with Checkov security scanning  
✅ **Security Gates** - CD pipeline blocked until infrastructure security passes  
✅ **Real DORA Metrics** - Deployment frequency, lead time, failure rate with timestamps  
✅ **Infrastructure as Code** - 100% Terraform-managed AWS infrastructure  
✅ **Production Monitoring** - CloudWatch dashboards with automated alarms  
✅ **Global CDN** - CloudFront distribution with HTTPS encryption  
✅ **Multiple Deployment Strategies** - Continuous Deployment + Continuous Delivery

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
- HTTPS encryption enabled
- Low latency worldwide (edge caching)
- Cost-effective serverless hosting

## 🚀 DevOps Pipeline Flow

```
Developer Push → GitHub
    ↓
CI Pipeline (GitHub Actions)
    ├─ Checkout code
    ├─ Install dependencies
    ├─ Lint (ESLint + TypeScript) - HARD GATE
    ├─ Unit Tests (Jest) - HARD GATE
    ├─ Security Scan (npm audit) - HARD GATE
    └─ Build artifacts
    ↓
Terraform CI Pipeline (if infrastructure changed)
    ├─ Terraform format check - HARD GATE
    ├─ Terraform validation - HARD GATE
    └─ Checkov security scanning - HARD GATE
    ↓
CD Pipeline (on main branch)
    ├─ Security Gate: Wait for Terraform CI completion
    ├─ Deploy Backend (Lambda via S3)
    ├─ Deploy Frontend (S3 + CloudFront)
    ├─ Calculate Real DORA Metrics
    │  ├─ Deployment frequency (GitHub API)
    │  ├─ Lead time for changes (commit → deploy)
    │  ├─ Change failure rate (failed vs total)
    │  └─ MTTR (time between failure and recovery)
    └─ CloudWatch Monitoring Active
    ↓
Production Environment (AWS)
    ├─ Lambda functions serving API
    ├─ CloudFront distributing frontend globally
    ├─ DynamoDB storing data
    └─ CloudWatch monitoring health
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
cd infrastructure-simple
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
- `AWS_ACCESS_KEY_ID` - AWS access key (from personal AWS account)
- `AWS_SECRET_ACCESS_KEY` - AWS secret key (from personal AWS account)
- Note: No session token needed for personal AWS accounts

### Workflows

**1. CI Pipeline** (`.github/workflows/ci-simple.yml`)
- Triggers on: Every push to any branch
- Runs: Lint, test, security scans, build
- Purpose: Continuous Integration - catch issues early

**2. Terraform CI Pipeline** (`.github/workflows/terraform-ci.yml`)
- Triggers on: Pull requests to main, pushes affecting infrastructure-simple/**
- Runs: Terraform format check, validation, Checkov security scanning
- Purpose: Infrastructure validation and security compliance

**3. CD Pipeline** (`.github/workflows/cd.yml`)
- Triggers on: Push to `main` branch
- Runs: Deploy backend + frontend + DORA metrics calculation
- Features: Security gates that wait for Terraform CI completion
- Purpose: Continuous Deployment with security validation

**4. Continuous Delivery Pipeline** (`.github/workflows/continuous-delivery.yml`)
- Triggers on: Push to `staging` branch
- Runs: Build + test + **manual approval** + deploy
- Purpose: Controlled releases with human verification

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

## 📊 Production Monitoring & Observability

### CloudWatch Dashboard
Real-time metrics dashboard showing:
- Lambda invocations and errors
- API Gateway request volume and latency
- Response times and performance metrics

### Automated Alarms
Four production alarms monitoring:
1. **Lambda Errors** - Triggers if >5 errors in 5 minutes
2. **API Gateway 5xx Errors** - Triggers if >10 server errors in 5 minutes  
3. **Lambda Performance** - Triggers if average response time >3 seconds
4. **DynamoDB Throttling** - Triggers if database is overloaded

### Smoke Tests
Automated post-deployment validation:
- API health endpoint check
- Task creation functionality test
- Frontend availability verification

All logs are sent to **AWS CloudWatch Logs** with structured JSON formatting for easy querying.

## 🔒 DevSecOps Integration

Security is integrated throughout the pipeline:

1. **Dependency Scanning**: `npm audit` fails on high/critical vulnerabilities
2. **Infrastructure Security**: Checkov scans Terraform for security misconfigurations
3. **Security Gates**: CD pipeline waits for Terraform CI security validation
4. **Linting**: ESLint enforces code quality standards
5. **Least Privilege IAM**: Terraform creates minimal IAM roles
6. **Secrets Management**: No secrets in code, only GitHub Secrets
7. **HTTPS Everywhere**: CloudFront enforces HTTPS encryption

## 📁 Repository Structure

```
.
├── frontend/                    # React + TypeScript frontend
├── backend/                     # Express + TypeScript API
├── infrastructure-simple/       # Terraform IaC (production-ready)
├── .github/workflows/           # CI/CD pipelines
│   ├── ci-simple.yml           # Continuous Integration
│   ├── terraform-ci.yml        # Infrastructure validation & security
│   ├── cd.yml                  # Continuous Deployment (main)
│   └── continuous-delivery.yml # Continuous Delivery (staging)
├── docs/                        # Documentation
│   ├── metrics.md              # DORA metrics explanation
│   ├── iac-compliance.md       # Infrastructure compliance
│   └── stride-security-analysis.md # Security analysis
├── DEMO_TALKING_POINTS.md      # Demo presentation guide
└── README.md                   # This file
```

## 🎯 Demo Checklist

For your 20-minute demo, showcase:

1. ✅ **Code Quality** - Run `npm run lint` and `npm test` locally
2. ✅ **CI Pipeline** - Show GitHub Actions CI workflow logs
3. ✅ **Terraform CI** - Show infrastructure validation and security scanning
4. ✅ **Security Gates** - Demonstrate how Terraform failures block CD pipeline
5. ✅ **IaC** - Walk through `infrastructure-simple/` Terraform files
6. ✅ **DORA Metrics** - Show real deployment metrics with timestamps
7. ✅ **Live App** - Demo the working application
8. ✅ **Monitoring** - Show CloudWatch dashboards and alarms
9. ✅ **Compliance Evidence** - Show pipeline artifacts and security reports

## 📚 Additional Documentation

- `DEMO_TALKING_POINTS.md` - Comprehensive demo guide and talking points
- `docs/metrics.md` - DORA metrics calculation and DevOps effectiveness
- `docs/iac-compliance.md` - Infrastructure as Code compliance and validation
- `docs/stride-security-analysis.md` - Security threat analysis and mitigation

## 🤝 Contributing

This is a demo project for educational purposes. The focus is on DevOps practices, not application features.

## 📄 License

MIT License - Educational use
