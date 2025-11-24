# User Stories and DevOps Stories

## 📱 User Stories (Application Features)

### US-1: Add Tasks
**As a** busy student  
**I want to** add tasks to a to-do list with a title and optional description  
**So that** I don't forget work I need to complete

**Acceptance Criteria**:
- User can enter a task title (required)
- User can optionally add a description
- Task appears immediately in the list after creation
- Empty titles are rejected with a clear error message

---

### US-2: Mark Tasks Complete
**As a** user  
**I want to** mark tasks as complete or incomplete  
**So that** I can see what I've finished and what's still pending

**Acceptance Criteria**:
- User can toggle task completion status with a single click
- Completed tasks are visually distinct (e.g., strikethrough)
- Completion status persists across page refreshes

---

### US-3: Delete Tasks
**As a** user  
**I want to** delete tasks I no longer need  
**So that** my list stays clean and relevant

**Acceptance Criteria**:
- User can delete any task
- Deleted tasks are removed immediately from the UI
- Deletion is permanent (no undo in this version)

---

### US-4: Persistent Cloud Storage
**As a** user  
**I want to** have my tasks stored in the cloud  
**So that** I can access them from multiple devices and they survive browser refreshes

**Acceptance Criteria**:
- Tasks are stored in AWS DynamoDB
- Tasks persist across browser sessions
- Tasks are accessible from any device with internet connection

---

### US-5: View All Tasks
**As a** user  
**I want to** see all my tasks in a clear list  
**So that** I can quickly understand what needs to be done

**Acceptance Criteria**:
- All tasks are displayed in a list format
- Most recent tasks appear first
- UI clearly shows task title, description, and completion status

---

## 🔧 DevOps Stories (Pipeline & Infrastructure)

### DS-1: Automated Unit Testing
**As a** DevOps engineer  
**I want** automated unit tests to run on each push  
**So that** broken code is caught before integration and deployment

**Acceptance Criteria**:
- Unit tests run automatically in CI pipeline
- Pipeline fails if any test fails
- Test results are visible in GitHub Actions logs
- Test coverage includes critical business logic (task CRUD operations)

**Implementation**: Jest tests in `backend/tests/` and `frontend/src/__tests__/`

---

### DS-2: Code Quality Enforcement
**As a** DevOps engineer  
**I want** linting and static analysis to run automatically  
**So that** code quality standards are enforced consistently

**Acceptance Criteria**:
- ESLint runs on every push
- TypeScript type checking is enforced
- Pipeline fails if linting errors are found
- Consistent code style across frontend and backend

**Implementation**: ESLint + TypeScript in CI pipeline

---

### DS-3: Dependency Vulnerability Scanning
**As a** security-conscious developer  
**I want** dependency vulnerability scans on every build  
**So that** insecure libraries are detected early (shift-left security)

**Acceptance Criteria**:
- `npm audit` runs in CI pipeline
- High/critical vulnerabilities fail the build
- Scan results are logged for compliance evidence
- Dependencies are regularly updated

**Implementation**: npm audit + GitHub CodeQL in `.github/workflows/ci.yml`

---

### DS-4: Automated Deployment Pipeline
**As a** release manager  
**I want** an automated deployment pipeline  
**So that** releases to production are consistent, repeatable, and low-risk

**Acceptance Criteria**:
- Deployments trigger automatically on merge to `main`
- Infrastructure is provisioned via Terraform (IaC)
- Application artifacts are deployed without manual intervention
- Rollback capability exists (via Terraform state)

**Implementation**: GitHub Actions deploy workflow + Terraform

---

### DS-5: Infrastructure as Code
**As a** DevOps engineer  
**I want** all infrastructure defined as code  
**So that** environments are reproducible and version-controlled

**Acceptance Criteria**:
- All AWS resources defined in Terraform
- Infrastructure changes go through code review
- Infrastructure state is managed centrally
- Documentation explains how to provision from scratch

**Implementation**: Terraform in `infrastructure/` directory

---

### DS-6: Compliance Evidence & Audit Logs
**As a** compliance officer  
**I want** stored logs of test and security scan results  
**So that** I can evidence that quality checks were performed

**Acceptance Criteria**:
- CI pipeline logs are retained in GitHub Actions
- Test results are clearly visible
- Security scan results are logged
- Deployment history is traceable

**Implementation**: GitHub Actions artifacts + CloudWatch logs

---

### DS-7: Structured Logging & Observability
**As a** site reliability engineer  
**I want** structured JSON logs with request tracing  
**So that** I can debug issues and monitor application health

**Acceptance Criteria**:
- All backend logs are JSON formatted
- Each request has a unique correlation ID
- Logs include timestamp, level, message, and context
- Logs are centralized in CloudWatch

**Implementation**: Winston logger in `backend/src/utils/logger.ts`

---

### DS-8: Continuous Integration & Continuous Delivery
**As a** development team  
**I want** CI/CD pipelines that provide fast feedback  
**So that** we can iterate quickly while maintaining quality

**Acceptance Criteria**:
- CI runs in under 5 minutes
- Developers get immediate feedback on PRs
- Main branch is always deployable
- Deployments complete in under 10 minutes

**Implementation**: Optimized GitHub Actions workflows

---

## 🎯 Story Mapping to Pipeline Stages

| Story | Pipeline Stage | Evidence Location |
|-------|---------------|-------------------|
| DS-1 | CI: Test | GitHub Actions → CI workflow → Test step |
| DS-2 | CI: Lint | GitHub Actions → CI workflow → Lint step |
| DS-3 | CI: Security | GitHub Actions → CI workflow → Security scan step |
| DS-4 | CD: Deploy | GitHub Actions → Deploy workflow → Deploy steps |
| DS-5 | CD: Infrastructure | GitHub Actions → Deploy workflow → Terraform apply |
| DS-6 | All stages | GitHub Actions logs + CloudWatch |
| DS-7 | Runtime | AWS CloudWatch Logs |
| DS-8 | All stages | Complete workflow execution time |

---

## 📊 Demonstrating Stories in Your Presentation

### For User Stories:
1. Show the live application
2. Demonstrate each feature (add, complete, delete tasks)
3. Show persistence by refreshing the page

### For DevOps Stories:
1. **DS-1 & DS-2**: Show GitHub Actions CI workflow with passing tests and lint
2. **DS-3**: Point out security scan step and npm audit results
3. **DS-4 & DS-5**: Walk through deploy workflow and Terraform code
4. **DS-6**: Show GitHub Actions logs as compliance evidence
5. **DS-7**: Show CloudWatch logs with request IDs
6. **DS-8**: Show workflow execution times and green checkmarks

This demonstrates a mature DevOps practice where every requirement is traceable to implementation and evidence.
