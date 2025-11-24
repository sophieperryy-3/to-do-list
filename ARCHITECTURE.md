# Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER / BROWSER                              │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AWS CLOUDFRONT (CDN)                            │
│  • Global edge locations                                            │
│  • HTTPS enforcement                                                 │
│  • Caching (low latency)                                            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AWS S3 BUCKET (Frontend)                          │
│  • Static files (HTML, JS, CSS)                                     │
│  • React + TypeScript SPA                                           │
│  • Versioning enabled                                               │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ API Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AWS API GATEWAY (HTTP API)                         │
│  • RESTful endpoints                                                 │
│  • CORS configuration                                                │
│  • Request/response logging                                         │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ Invoke
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AWS LAMBDA (Backend API)                          │
│  • Node.js 20 runtime                                                │
│  • Express.js application                                            │
│  • Serverless compute                                                │
│  • Auto-scaling                                                      │
└────────────────┬───────────────────────────────┬────────────────────┘
                 │                               │
                 │ Read/Write                    │ Write Logs
                 ▼                               ▼
┌─────────────────────────────┐  ┌──────────────────────────────────┐
│   AWS DYNAMODB (Database)   │  │   AWS CLOUDWATCH LOGS            │
│  • NoSQL key-value store    │  │  • Structured JSON logs          │
│  • On-demand billing        │  │  • Request tracing               │
│  • Encryption at rest       │  │  • Monitoring & alerting         │
│  • Point-in-time recovery   │  │  • Log retention (30 days)       │
└─────────────────────────────┘  └──────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER                                    │
│                    (git push to GitHub)                              │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         GITHUB REPOSITORY                            │
│  • Source code (frontend + backend)                                  │
│  • Infrastructure as Code (Terraform)                                │
│  • CI/CD workflows (GitHub Actions)                                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ Trigger
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CI PIPELINE (GitHub Actions)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 1. Checkout Code                                              │  │
│  │ 2. Install Dependencies                                       │  │
│  │ 3. Lint (ESLint) ◄─── QUALITY GATE                          │  │
│  │ 4. Type Check (TypeScript)                                   │  │
│  │ 5. Unit Tests (Jest) ◄─── QUALITY GATE                      │  │
│  │ 6. Security Scan (npm audit) ◄─── DEVSECOPS                 │  │
│  │ 7. CodeQL Analysis ◄─── DEVSECOPS                           │  │
│  │ 8. Build Artifacts                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ If main branch
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   CD PIPELINE (GitHub Actions)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 1. Re-run CI Checks                                          │  │
│  │ 2. Build Backend (TypeScript → JavaScript)                   │  │
│  │ 3. Terraform Init                                            │  │
│  │ 4. Terraform Plan ◄─── INFRASTRUCTURE AS CODE               │  │
│  │ 5. Terraform Apply ◄─── INFRASTRUCTURE AS CODE              │  │
│  │ 6. Deploy Backend (Lambda)                                   │  │
│  │ 7. Build Frontend (with API URL)                            │  │
│  │ 8. Deploy Frontend (S3)                                      │  │
│  │ 9. Invalidate CloudFront Cache                              │  │
│  │ 10. Smoke Tests ◄─── VERIFICATION                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AWS PRODUCTION ENVIRONMENT                      │
│  • Lambda function updated                                           │
│  • S3 bucket updated                                                 │
│  • CloudFront cache invalidated                                      │
│  • Infrastructure provisioned/updated                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────────┘

1. NETWORK SECURITY
   ├─ CloudFront: HTTPS only (TLS 1.2+)
   ├─ API Gateway: HTTPS endpoints
   └─ S3: Private bucket (CloudFront OAI only)

2. IAM SECURITY (Least Privilege)
   ├─ Lambda Execution Role:
   │  ├─ DynamoDB: Read/Write to specific table only
   │  └─ CloudWatch: Write logs to specific log group only
   └─ CloudFront OAI:
      └─ S3: Read objects from specific bucket only

3. DATA SECURITY
   ├─ DynamoDB: Encryption at rest (AWS managed keys)
   ├─ S3: Encryption at rest (AES256)
   └─ CloudWatch Logs: Encrypted

4. APPLICATION SECURITY
   ├─ Input Validation: All API inputs validated
   ├─ CORS: Configured for specific origins
   └─ Error Handling: No sensitive data in error messages

5. DEVSECOPS (Shift-Left Security)
   ├─ Dependency Scanning: npm audit in CI
   ├─ Static Analysis: CodeQL in CI
   ├─ Secret Management: GitHub Secrets (not in code)
   └─ Automated Scans: Every build is scanned
```

---

## 📊 Data Flow

### Create Task Flow

```
User (Browser)
    │
    │ 1. POST /tasks { title: "Buy milk" }
    ▼
CloudFront (CDN)
    │
    │ 2. Forward to API
    ▼
API Gateway
    │
    │ 3. Invoke Lambda
    ▼
Lambda (Express)
    │
    │ 4. Validate input
    │ 5. Generate UUID
    │ 6. Add timestamps
    ▼
DynamoDB
    │
    │ 7. Store task
    ▼
Lambda (Express)
    │
    │ 8. Return task object
    ▼
API Gateway
    │
    │ 9. Return response
    ▼
CloudFront
    │
    │ 10. Return to browser
    ▼
User (Browser)
    │
    │ 11. Update UI
```

### Logging Flow

```
Lambda Function
    │
    │ 1. Generate request ID
    │ 2. Log structured JSON
    ▼
CloudWatch Logs
    │
    │ 3. Store logs (30 days retention)
    ▼
CloudWatch Insights
    │
    │ 4. Query and analyze
    ▼
CloudWatch Alarms (Optional)
    │
    │ 5. Trigger on errors
    ▼
SNS / Lambda (Optional)
    │
    │ 6. Send alerts / Take action
```

---

## 🏗️ Infrastructure as Code (Terraform)

```
Terraform Configuration
    │
    ├─ main.tf (Provider setup)
    │
    ├─ dynamodb.tf
    │  └─ Creates: DynamoDB table
    │
    ├─ lambda.tf
    │  ├─ Creates: Lambda function
    │  ├─ Creates: IAM role & policies
    │  └─ Creates: CloudWatch log group
    │
    ├─ api-gateway.tf
    │  ├─ Creates: HTTP API
    │  ├─ Creates: Lambda integration
    │  └─ Creates: Routes & stage
    │
    ├─ s3-frontend.tf
    │  ├─ Creates: S3 bucket
    │  ├─ Creates: Bucket policy
    │  └─ Enables: Versioning & encryption
    │
    └─ cloudfront.tf
       ├─ Creates: CloudFront distribution
       ├─ Creates: Origin Access Identity
       └─ Configures: HTTPS & caching
```

---

## 🔄 Deployment Flow

```
1. Developer pushes code to GitHub
        ↓
2. GitHub Actions CI runs
   • Lint, test, security scan
   • Build artifacts
        ↓
3. If main branch: GitHub Actions CD runs
        ↓
4. Terraform provisions/updates infrastructure
   • DynamoDB table
   • Lambda function
   • API Gateway
   • S3 bucket
   • CloudFront distribution
        ↓
5. Backend deployed to Lambda
   • Compiled JavaScript uploaded
   • Function code updated
        ↓
6. Frontend deployed to S3
   • Built with production API URL
   • Static files uploaded
   • CloudFront cache invalidated
        ↓
7. Smoke tests verify deployment
   • API health check
   • Tasks endpoint check
        ↓
8. Application live in production
```

---

## 📈 Observability Architecture

```
Application Logs
    │
    ├─ Request ID (correlation)
    ├─ Timestamp (ISO 8601)
    ├─ Log Level (info/warn/error)
    ├─ HTTP Method & Path
    ├─ Status Code
    ├─ Duration (ms)
    └─ Metadata (task IDs, etc.)
    │
    ▼
CloudWatch Logs
    │
    ├─ Log Group: /aws/lambda/todo-api-function
    ├─ Retention: 30 days
    └─ Format: JSON
    │
    ▼
CloudWatch Insights
    │
    ├─ Query: Find errors
    ├─ Query: Calculate avg response time
    ├─ Query: Identify slow requests
    └─ Query: Track requests by endpoint
    │
    ▼
CloudWatch Alarms (Optional)
    │
    ├─ Alarm: High error rate
    ├─ Alarm: High response time
    └─ Alarm: Lambda throttling
    │
    ▼
SNS Notifications (Optional)
    │
    └─ Alert on-call engineer
```

---

## 🎯 Key Architectural Decisions

### 1. Serverless vs. Containers
**Decision**: Serverless (Lambda)  
**Rationale**: 
- Auto-scaling without configuration
- Pay-per-request (cost-effective for demo)
- No server management
- Built-in high availability

### 2. DynamoDB vs. RDS
**Decision**: DynamoDB  
**Rationale**:
- Serverless (no provisioning)
- Simple key-value model fits use case
- On-demand billing
- Single-digit millisecond latency

### 3. S3 + CloudFront vs. Amplify Hosting
**Decision**: S3 + CloudFront  
**Rationale**:
- More control over configuration
- Industry-standard approach
- Better for learning IaC
- Lower cost

### 4. Terraform vs. CloudFormation
**Decision**: Terraform  
**Rationale**:
- Cloud-agnostic (portable)
- Better documentation
- More widely used in industry
- Cleaner syntax (HCL vs. JSON/YAML)

### 5. GitHub Actions vs. AWS CodePipeline
**Decision**: GitHub Actions  
**Rationale**:
- CI/CD with source code
- Rich ecosystem of actions
- Free for public repos
- More portable

---

## 📚 Technology Choices Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + TypeScript + Vite | Fast builds, type safety, modern |
| Backend | Express + TypeScript | Familiar, flexible, type-safe |
| Compute | AWS Lambda | Serverless, auto-scaling, cost-effective |
| API | API Gateway HTTP API | Simple, cheap, integrates with Lambda |
| Database | DynamoDB | Serverless, fast, simple schema |
| Storage | S3 | Static hosting, cheap, reliable |
| CDN | CloudFront | Global, HTTPS, caching |
| IaC | Terraform | Cloud-agnostic, widely used |
| CI/CD | GitHub Actions | Integrated with Git, rich ecosystem |
| Logging | CloudWatch Logs | Native AWS, structured logs |

---

This architecture demonstrates production-grade DevOps practices suitable for enterprise environments while remaining simple enough to understand and explain in a 20-minute demo.
