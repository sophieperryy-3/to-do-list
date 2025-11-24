# To-Do API Backend

Express + TypeScript REST API deployed to AWS Lambda.

## 🏗️ Architecture

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: AWS DynamoDB
- **Deployment**: AWS Lambda + API Gateway
- **Logging**: Winston (JSON structured logs → CloudWatch)

## 📋 API Endpoints

### Health Check
```
GET /health
```

### Tasks
```
GET    /tasks       - Get all tasks
GET    /tasks/:id   - Get a single task
POST   /tasks       - Create a new task
PATCH  /tasks/:id   - Update a task
DELETE /tasks/:id   - Delete a task
```

### Request/Response Examples

**Create Task**:
```bash
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2025-11-24T10:30:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  }
}
```

**Update Task**:
```bash
PATCH /tasks/:id
Content-Type: application/json

{
  "completed": true
}

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- AWS CLI configured
- DynamoDB table created (or use local DynamoDB)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your AWS credentials and table name
```

3. Run development server:
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run linting:
```bash
npm run lint
```

## 🏗️ Build for Production

Compile TypeScript to JavaScript:
```bash
npm run build
```

Output goes to `dist/` directory.

## 📦 Deployment

Deployment is automated via GitHub Actions and Terraform.

The Lambda function is created by Terraform and uses `dist/lambda.js` as the entry point.

## 🔒 Environment Variables

Required in production:
- `DYNAMODB_TABLE_NAME` - DynamoDB table name
- `AWS_REGION` - AWS region
- `CORS_ORIGIN` - Frontend URL for CORS

Optional:
- `LOG_LEVEL` - Logging level (default: info)
- `NODE_ENV` - Environment (development/production)

## 📊 Logging

All logs are JSON formatted and include:
- Request ID for tracing
- Timestamp
- Log level
- HTTP method and path
- Response status code
- Duration

View logs in CloudWatch:
```bash
aws logs tail /aws/lambda/todo-api-function --follow
```

## 🧪 Testing Strategy

- **Unit tests**: Validation logic, business rules
- **Integration tests**: (Not included in this demo, but would test DynamoDB integration)
- **E2E tests**: (Not included, but would test full API flows)

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/          # Data models and validation
│   ├── routes/          # Express route handlers
│   ├── services/        # Business logic (DynamoDB operations)
│   ├── utils/           # Utilities (logger, config)
│   ├── server.ts        # Express app setup
│   └── lambda.ts        # Lambda handler wrapper
├── tests/               # Unit tests
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 DevOps Integration

This backend is designed for DevOps best practices:

1. **CI/CD**: Automated testing and deployment via GitHub Actions
2. **IaC**: Infrastructure provisioned by Terraform
3. **Observability**: Structured logging to CloudWatch
4. **Security**: No secrets in code, IAM roles for AWS access
5. **Quality**: Linting, type checking, unit tests

See main README for full pipeline documentation.
