# To-Do Frontend

React + TypeScript + Vite frontend deployed to S3 + CloudFront.

## 🏗️ Architecture

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite (fast builds, HMR)
- **Deployment**: AWS S3 + CloudFront CDN
- **Styling**: Inline styles (simple, no dependencies)

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Backend API running (see backend/README.md)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

The Vite dev server proxies `/api` requests to `http://localhost:3000` (backend).

### Testing

Run unit tests:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

Type checking:
```bash
npm run type-check
```

## 🏗️ Build for Production

Build static assets:
```bash
npm run build
```

Output goes to `dist/` directory, ready for S3 deployment.

Preview production build locally:
```bash
npm run preview
```

## 🌐 Environment Variables

The frontend uses environment variables for configuration:

- `VITE_API_URL` - Backend API URL (set at build time)

**Development**: Uses Vite proxy, no need to set VITE_API_URL

**Production**: Set VITE_API_URL to your API Gateway URL:
```bash
echo "VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod" > .env.production
npm run build
```

## 📦 Deployment

Deployment is automated via GitHub Actions and Terraform.

1. Terraform creates S3 bucket and CloudFront distribution
2. GitHub Actions builds the app with production API URL
3. Built files are uploaded to S3
4. CloudFront cache is invalidated

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client for backend
│   ├── components/       # React components
│   │   ├── AddTaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   ├── __tests__/        # Unit tests
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── dist/                 # Build output (generated)
├── index.html            # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Features

- ✅ Add tasks with title and description
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Persistent storage (DynamoDB via API)
- ✅ Error handling with user feedback
- ✅ Loading states
- ✅ Responsive design
- ✅ TypeScript for type safety

## 🔧 DevOps Integration

This frontend is designed for DevOps best practices:

1. **Fast Builds**: Vite provides sub-second HMR and fast production builds
2. **Type Safety**: TypeScript catches errors at compile time
3. **Linting**: ESLint enforces code quality
4. **Testing**: Jest for unit tests
5. **Environment Config**: Build-time environment variables
6. **Static Hosting**: S3 + CloudFront for global CDN
7. **CI/CD**: Automated testing and deployment

See main README for full pipeline documentation.
