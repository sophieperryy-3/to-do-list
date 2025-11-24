# 20-Minute Demo Checklist

Quick reference for your DevOps To-Do List presentation.

## 🎯 Before Demo

### Preparation (1 day before)
- [ ] Deploy application to AWS
- [ ] Verify application works end-to-end
- [ ] Test all features (add, complete, delete tasks)
- [ ] Run CI pipeline and verify it passes
- [ ] Run CD pipeline and verify deployment succeeds
- [ ] Take screenshots of:
  - [ ] GitHub Actions CI passing
  - [ ] GitHub Actions CD passing
  - [ ] CloudWatch logs
  - [ ] Working application
  - [ ] Terraform outputs
- [ ] Practice demo timing (aim for 18 minutes, leave 2 for Q&A)

### 30 Minutes Before Demo
- [ ] Open all necessary tabs in browser:
  - [ ] Live application (CloudFront URL)
  - [ ] GitHub repository
  - [ ] GitHub Actions (CI workflow)
  - [ ] GitHub Actions (Deploy workflow)
  - [ ] AWS Console (CloudWatch Logs)
  - [ ] AWS Console (DynamoDB)
- [ ] Open code editor with project loaded
- [ ] Test internet connection
- [ ] Close unnecessary applications
- [ ] Silence notifications
- [ ] Have backup screenshots ready (in case of network issues)

---

## 📋 Demo Script (20 Minutes)

### Slide 1: Introduction (2 minutes)

**Say:**
> "Today I'm presenting a DevOps-focused To-Do List application. The emphasis is on the DevOps pipeline, not fancy features. I'll demonstrate CI/CD, Infrastructure as Code, DevSecOps, and observability."

**Show:**
- Architecture diagram (draw or show README)
- Tech stack: React, Express, Lambda, DynamoDB, Terraform, GitHub Actions

**Key Points:**
- Serverless architecture (Lambda, DynamoDB)
- Fully automated CI/CD
- Infrastructure as Code with Terraform
- Security integrated throughout (DevSecOps)

---

### Slide 2: User & DevOps Stories (3 minutes)

**Say:**
> "Let me walk through the user stories and DevOps stories that drove this implementation."

**Show:**
- Open `docs/user-and-devops-stories.md`

**Highlight:**
- **User Stories**: Add tasks, mark complete, delete, cloud persistence
- **DevOps Stories**: 
  - DS-1: Automated unit testing
  - DS-3: Dependency vulnerability scanning (DevSecOps)
  - DS-4: Automated deployment pipeline
  - DS-5: Infrastructure as Code
  - DS-7: Structured logging & observability

**Key Points:**
- Every DevOps story maps to pipeline implementation
- Stories provide compliance evidence
- Focus on automation and quality gates

---

### Slide 3: Application Code (3 minutes)

**Say:**
> "Let me show you the application code structure, focusing on DevOps-friendly practices."

**Show Backend:**
- Open `backend/src/server.ts`
  - Point out request ID middleware (for tracing)
  - Point out structured logging
  - Point out health check endpoint

- Open `backend/src/utils/logger.ts`
  - Show JSON structured logs
  - Explain how logs go to CloudWatch

**Show Frontend:**
- Open `frontend/src/App.tsx`
  - Point out error handling
  - Point out environment variable usage (VITE_API_URL)

**Key Points:**
- Configuration via environment variables (12-factor app)
- Structured logging for observability
- Error handling for resilience

---

### Slide 4: Infrastructure as Code (4 minutes)

**Say:**
> "All infrastructure is defined as code using Terraform. Let me walk through the key resources."

**Show:**
- Open `infrastructure/main.tf`
- Open `infrastructure/dynamodb.tf`
  - Point out on-demand billing
  - Point out encryption at rest

- Open `infrastructure/lambda.tf`
  - Point out IAM role with least privilege
  - Point out environment variables
  - Point out CloudWatch log group

- Open `infrastructure/api-gateway.tf`
  - Point out CORS configuration
  - Point out access logging

**Key Points:**
- All resources version-controlled
- Declarative configuration (desired state)
- Idempotent (can run multiple times safely)
- Outputs used by CI/CD pipeline

---

### Slide 5: CI/CD Pipeline (4 minutes)

**Say:**
> "The CI/CD pipeline automates testing, security scanning, and deployment."

**Show CI Pipeline:**
- Open `.github/workflows/ci.yml`
- Walk through stages:
  1. Checkout
  2. Install dependencies
  3. **Lint** (code quality gate)
  4. **Type check** (TypeScript)
  5. **Unit tests** (quality gate)
  6. **Security scan** (npm audit - DevSecOps)
  7. **CodeQL** (static analysis - DevSecOps)
  8. Build

- Show GitHub Actions CI run (passing)

**Show CD Pipeline:**
- Open `.github/workflows/deploy.yml`
- Walk through stages:
  1. Re-run CI checks
  2. **Terraform plan/apply** (IaC)
  3. Deploy backend (Lambda)
  4. Deploy frontend (S3 + CloudFront)
  5. **Smoke tests** (verify deployment)

- Show GitHub Actions Deploy run (passing)

**Key Points:**
- CI runs on every push (fast feedback)
- CD runs on main branch (automated deployment)
- Security scans integrated (shift-left)
- Pipeline fails if tests fail (quality gates)

---

### Slide 6: DevSecOps (2 minutes)

**Say:**
> "Security is integrated throughout the pipeline, not bolted on at the end."

**Show:**
- Point out in `ci.yml`:
  - npm audit (dependency vulnerabilities)
  - CodeQL (static analysis)

- Show GitHub Security tab (if available)

**Explain:**
- **Shift-left security**: Catch vulnerabilities early
- **Automated scans**: Every build is scanned
- **Compliance evidence**: All scan results logged

**Key Points:**
- Security in CI, not just production
- Automated, not manual
- Fail fast on critical vulnerabilities

---

### Slide 7: Logging & Observability (2 minutes)

**Say:**
> "All logs are structured JSON and sent to CloudWatch for monitoring and debugging."

**Show:**
- Open AWS Console → CloudWatch Logs
- Show log group: `/aws/lambda/todo-api-function`
- Show a log entry with:
  - Request ID
  - Timestamp
  - HTTP method/path
  - Duration
  - Status code

**Explain:**
- Request ID traces requests end-to-end
- JSON format enables powerful queries
- CloudWatch Insights for analysis
- Could trigger alerts on errors

**Show (if time):**
- Open `docs/logging-and-observability.md`
- Point out CloudWatch Insights queries
- Explain how logs could detect brute-force attacks

---

### Slide 8: Live Demo (3 minutes)

**Say:**
> "Let me demonstrate the live application."

**Show:**
1. Open CloudFront URL
2. **Add a task**: "Finish DevOps presentation"
3. **Mark it complete**: Check the checkbox
4. **Add another task**: "Deploy to production"
5. **Delete first task**: Click delete
6. **Refresh page**: Show tasks persist (DynamoDB)

**Then show logs:**
- Go to CloudWatch Logs
- Show the requests you just made
- Point out request IDs, timestamps, status codes

**Key Points:**
- Application works end-to-end
- Data persists in DynamoDB
- All requests logged for observability

---

### Slide 9: AWS Source Control Discussion (1 minute)

**Say:**
> "My lecturer asked about AWS not having source control. Here's how we handle it."

**Explain:**
- **Problem**: AWS has no native Git/source control
- **Solution**: Use GitHub as source of truth
- **Advantages**:
  - Industry-standard Git workflows
  - Rich CI/CD ecosystem
  - Separation of concerns (code vs. infrastructure)
- **Disadvantages**:
  - Need to manage AWS credentials in GitHub
  - Two platforms to monitor

**Key Point:**
- AWS is deployment target, not source control
- GitHub Actions orchestrates deployments to AWS

---

### Slide 10: Conclusion & Q&A (1 minute)

**Say:**
> "To summarize, I've demonstrated a production-grade DevOps pipeline with:"

**Recap:**
- ✅ Continuous Integration (automated testing)
- ✅ Continuous Deployment (automated releases)
- ✅ Infrastructure as Code (Terraform)
- ✅ DevSecOps (security in pipeline)
- ✅ Observability (structured logging)
- ✅ Compliance evidence (all logs retained)

**Say:**
> "Questions?"

---

## 🎤 Key Talking Points

### Emphasize These Throughout:
1. **Automation**: Everything is automated, no manual steps
2. **Quality Gates**: Pipeline fails if tests/lint/security fail
3. **Compliance**: All logs retained as evidence
4. **Security**: Integrated throughout (shift-left)
5. **Observability**: Structured logs enable monitoring
6. **Reproducibility**: IaC ensures consistent environments

### Avoid These Pitfalls:
- ❌ Don't get lost in code details
- ❌ Don't spend too long on any one section
- ❌ Don't assume network will work (have screenshots)
- ❌ Don't forget to show GitHub Actions runs
- ❌ Don't skip the live demo

---

## 🚨 Backup Plan (If Network Fails)

If you can't access AWS/GitHub during demo:

1. **Show screenshots** of:
   - Working application
   - GitHub Actions passing
   - CloudWatch logs
   - Terraform outputs

2. **Walk through code** locally:
   - Show files in editor
   - Explain architecture
   - Show pipeline YAML files

3. **Explain** what you would show:
   - "Here I would show the live app..."
   - "In CloudWatch, you would see..."

---

## ✅ Post-Demo Checklist

After demo:
- [ ] Answer questions thoroughly
- [ ] Offer to share GitHub repository
- [ ] Mention any improvements you'd make
- [ ] Thank the audience

---

## 💡 Common Questions & Answers

**Q: Why serverless instead of containers?**
A: Serverless (Lambda) provides auto-scaling, pay-per-request pricing, and no server management. For a demo/small app, it's more cost-effective and simpler to operate.

**Q: How do you handle rollbacks?**
A: Terraform state allows infrastructure rollback. Lambda versions enable function rollback. S3 versioning enables frontend rollback.

**Q: What about database migrations?**
A: For this demo, DynamoDB schema is simple (just tasks). In production, I'd use migration tools like Flyway or Liquibase for relational databases.

**Q: How do you handle secrets?**
A: GitHub Secrets for CI/CD credentials. AWS Secrets Manager or Parameter Store for application secrets. Never commit secrets to Git.

**Q: What's the cost?**
A: ~$5-15/month for low traffic. Free tier covers most costs for first 12 months.

**Q: How long does deployment take?**
A: CI pipeline: 3-5 minutes. CD pipeline: 5-10 minutes. Total: ~15 minutes from push to production.

**Q: What about testing?**
A: Unit tests in CI. Integration tests would test DynamoDB. E2E tests would test full user flows. For this demo, focus is on pipeline, not comprehensive testing.

**Q: Why not use AWS CodePipeline?**
A: GitHub Actions is more widely used, has better ecosystem, and keeps CI/CD with source code. AWS CodePipeline is also valid but less portable.

---

## 🎯 Success Metrics

Your demo is successful if you:
- ✅ Stay within 20 minutes
- ✅ Show working application
- ✅ Explain CI/CD pipeline clearly
- ✅ Demonstrate DevSecOps integration
- ✅ Show Infrastructure as Code
- ✅ Explain observability
- ✅ Answer questions confidently

Good luck! 🚀
