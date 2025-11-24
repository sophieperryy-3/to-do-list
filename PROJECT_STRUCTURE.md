# Project Structure and File Descriptions

Complete overview of all files and folders in the DevOps To-Do List application.

## 📁 Root Directory

```
devops-todo-app/
├── backend/                    # Node.js + Express + TypeScript API
├── frontend/                   # React + TypeScript + Vite SPA
├── infrastructure/             # Terraform IaC for AWS
├── .github/workflows/          # GitHub Actions CI/CD pipelines
├── docs/                       # Documentation
├── README.md                   # Main project documentation
├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment instructions
├── PROJECT_STRUCTURE.md        # This file
└── .gitignore                  # Git ignore patterns
```

---

## 🔧 Backend (`backend/`)

### Source Code (`backend/src/`)

| File | Description |
|------|-------------|
| `server.ts` | Express app setup, middleware, routes, error handling |
| `lambda.ts` | AWS Lambda handler wrapper for Express app |
| `routes/tasks.ts` | HTTP endpoints for task CRUD operations |
| `services/taskService.ts` | Business logic for task operations (DynamoDB) |
| `models/task.ts` | Task data model and validation functions |
| `utils/config.ts` | Configuration management from environment variables |
| `utils/logger.ts` | Structured logging with Winston (JSON logs) |

### Tests (`backend/tests/`)

| File | Description |
|------|-------------|
| `taskService.test.ts` | Unit tests for task validation logic |

### Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript compiler configuration |
| `.eslintrc.cjs` | ESLint rules for code quality |
| `jest.config.js` | Jest test runner configuration |
| `.env.example` | Example environment variables |
| `README.md` | Backend-specific documentation |

### Generated (not in Git)

- `dist/` - Compiled JavaScript (created by `npm run build`)
- `node_modules/` - Dependencies (created by `npm install`)

---

## 🎨 Frontend (`frontend/`)

### Source Code (`frontend/src/`)

| File | Description |
|------|-------------|
| `main.tsx` | Application entry point, renders React app |
| `App.tsx` | Main app component, state management, API orchestration |
| `index.css` | Global CSS styles |
| `vite-env.d.ts` | TypeScript definitions for Vite environment |
| `setupTests.ts` | Jest test setup |

### Components (`frontend/src/components/`)

| File | Description |
|------|-------------|
| `TaskList.tsx` | Displays list of tasks with loading/error states |
| `TaskItem.tsx` | Individual task with checkbox, title, delete button |
| `AddTaskForm.tsx` | Form for creating new tasks |

### API Client (`frontend/src/api/`)

| File | Description |
|------|-------------|
| `client.ts` | HTTP client for backend API, all API calls |

### Tests (`frontend/src/__tests__/`)

| File | Description |
|------|-------------|
| `App.test.tsx` | Unit tests for frontend components |

### Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript compiler configuration |
| `tsconfig.node.json` | TypeScript config for Vite config file |
| `vite.config.ts` | Vite build tool configuration |
| `.eslintrc.cjs` | ESLint rules for code quality |
| `jest.config.js` | Jest test runner configuration |
| `index.html` | HTML template for SPA |
| `.env.example` | Example environment variables |
| `README.md` | Frontend-specific documentation |

### Generated (not in Git)

- `dist/` - Built static files (created by `npm run build`)
- `node_modules/` - Dependencies (created by `npm install`)

---

## ☁️ Infrastructure (`infrastructure/`)

### Terraform Files

| File | Description |
|------|-------------|
| `main.tf` | Provider configuration, AWS setup |
| `variables.tf` | Input variables (region, names, etc.) |
| `outputs.tf` | Output values (URLs, IDs, names) |
| `dynamodb.tf` | DynamoDB table for task storage |
| `lambda.tf` | Lambda function, IAM role, CloudWatch logs |
| `api-gateway.tf` | API Gateway HTTP API, routes, integration |
| `s3-frontend.tf` | S3 bucket for frontend hosting |
| `cloudfront.tf` | CloudFront CDN distribution |
| `terraform.tfvars.example` | Example variable values |
| `README.md` | Infrastructure deployment guide |

### Generated (not in Git)

- `.terraform/` - Terraform plugins and modules
- `*.tfstate` - Terraform state files (track infrastructure)
- `.terraform.lock.hcl` - Dependency lock file
- `lambda-deployment.zip` - Packaged Lambda function

---

## 🔄 CI/CD (`.github/workflows/`)

| File | Description |
|------|-------------|
| `ci.yml` | Continuous Integration pipeline (lint, test, security) |
| `deploy.yml` | Continuous Deployment pipeline (infrastructure + app) |

### CI Pipeline Stages (`ci.yml`)
1. Checkout code
2. Install dependencies
3. Lint (ESLint)
4. Type check (TypeScript)
5. Unit tests (Jest)
6. Security scan (npm audit)
7. Build artifacts
8. CodeQL security analysis

### CD Pipeline Stages (`deploy.yml`)
1. Re-run CI checks
2. Build backend
3. Terraform init/plan/apply
4. Deploy backend to Lambda
5. Build frontend with API URL
6. Deploy frontend to S3
7. Invalidate CloudFront cache
8. Smoke tests

---

## 📚 Documentation (`docs/`)

| File | Description |
|------|-------------|
| `user-and-devops-stories.md` | User stories and DevOps stories with acceptance criteria |
| `logging-and-observability.md` | Logging architecture, CloudWatch setup, alerting |

---

## 📄 Root Files

| File | Description |
|------|-------------|
| `README.md` | Main project documentation, architecture, setup |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment instructions |
| `PROJECT_STRUCTURE.md` | This file - complete file listing |
| `.gitignore` | Files/folders to exclude from Git |

---

## 🎯 Key Files for Demo

### For Code Walkthrough
1. `backend/src/server.ts` - Express app setup
2. `backend/src/routes/tasks.ts` - API endpoints
3. `backend/src/services/taskService.ts` - DynamoDB operations
4. `backend/src/utils/logger.ts` - Structured logging
5. `frontend/src/App.tsx` - Main React component
6. `frontend/src/api/client.ts` - API client

### For Infrastructure Explanation
1. `infrastructure/main.tf` - Provider setup
2. `infrastructure/dynamodb.tf` - Database
3. `infrastructure/lambda.tf` - Backend compute
4. `infrastructure/api-gateway.tf` - HTTP API
5. `infrastructure/s3-frontend.tf` - Frontend hosting
6. `infrastructure/cloudfront.tf` - CDN

### For CI/CD Demonstration
1. `.github/workflows/ci.yml` - CI pipeline
2. `.github/workflows/deploy.yml` - CD pipeline
3. GitHub Actions runs (in GitHub UI)

### For DevOps Stories
1. `docs/user-and-devops-stories.md` - All stories
2. `docs/logging-and-observability.md` - Observability setup

---

## 📊 File Count Summary

| Category | Count |
|----------|-------|
| Backend source files | 7 |
| Backend test files | 1 |
| Backend config files | 5 |
| Frontend source files | 8 |
| Frontend test files | 1 |
| Frontend config files | 7 |
| Infrastructure files | 9 |
| CI/CD workflows | 2 |
| Documentation files | 5 |
| **Total** | **45 files** |

---

## 🔑 Critical Files (Must Understand)

For your demo, focus on understanding these files deeply:

1. **README.md** - Overall architecture and setup
2. **docs/user-and-devops-stories.md** - Stories you'll reference
3. **backend/src/server.ts** - Backend entry point
4. **frontend/src/App.tsx** - Frontend entry point
5. **infrastructure/main.tf** - Infrastructure overview
6. **.github/workflows/ci.yml** - CI pipeline
7. **.github/workflows/deploy.yml** - CD pipeline
8. **docs/logging-and-observability.md** - Observability explanation

---

## 🚀 Quick Navigation

### To run locally:
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

### To test:
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

### To lint:
- Backend: `cd backend && npm run lint`
- Frontend: `cd frontend && npm run lint`

### To build:
- Backend: `cd backend && npm run build`
- Frontend: `cd frontend && npm run build`

### To deploy:
- Infrastructure: `cd infrastructure && terraform apply`
- Push to main: `git push origin main` (triggers CI/CD)

---

## 📝 Notes

- All TypeScript files compile to JavaScript in `dist/` folders
- All configuration uses environment variables (no hardcoded secrets)
- All infrastructure is defined as code (Terraform)
- All deployments are automated (GitHub Actions)
- All logs are structured JSON (CloudWatch)

This structure demonstrates production-grade DevOps practices suitable for enterprise environments.
