#!/bin/bash

# DevOps To-Do App - Setup Script
# This script helps you deploy the application step by step

set -e  # Exit on error

echo "🚀 DevOps To-Do App - Setup Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if git is initialized
if [ ! -d .git ]; then
    print_info "Git not initialized. Let's set it up!"
    echo ""
    
    read -p "Enter your GitHub username: " github_username
    read -p "Enter your repository name (default: devops-todo-app): " repo_name
    repo_name=${repo_name:-devops-todo-app}
    
    echo ""
    print_info "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: DevOps To-Do List application"
    
    echo ""
    print_warning "IMPORTANT: Create a repository on GitHub first!"
    print_info "Go to: https://github.com/new"
    print_info "Repository name: $repo_name"
    print_info "Make it PUBLIC (for free GitHub Actions)"
    print_info "DO NOT initialize with README"
    echo ""
    read -p "Press Enter after you've created the repository on GitHub..."
    
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    git branch -M main
    
    echo ""
    print_info "Pushing to GitHub..."
    git push -u origin main
    
    print_success "Code pushed to GitHub!"
    echo ""
else
    print_success "Git already initialized"
fi

# Check AWS CLI
echo ""
print_info "Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found!"
    print_info "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi
print_success "AWS CLI found"

# Check AWS credentials
echo ""
print_info "Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    print_success "AWS credentials configured"
    aws sts get-caller-identity
else
    print_warning "AWS credentials not configured"
    print_info "Run: aws configure"
    print_info "You'll need:"
    print_info "  - AWS Access Key ID"
    print_info "  - AWS Secret Access Key"
    print_info "  - Region (use: us-east-1)"
    echo ""
    read -p "Press Enter to configure AWS now..."
    aws configure
fi

# Check Node.js
echo ""
print_info "Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js not found!"
    print_info "Install it from: https://nodejs.org/"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check Terraform
echo ""
print_info "Checking Terraform..."
if ! command -v terraform &> /dev/null; then
    print_error "Terraform not found!"
    print_info "Install it from: https://www.terraform.io/downloads"
    exit 1
fi
print_success "Terraform found: $(terraform --version | head -n 1)"

# Install backend dependencies
echo ""
print_info "Installing backend dependencies..."
cd backend
if [ ! -d node_modules ]; then
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

# Build backend
print_info "Building backend..."
npm run build
print_success "Backend built successfully"
cd ..

# Install frontend dependencies
echo ""
print_info "Installing frontend dependencies..."
cd frontend
if [ ! -d node_modules ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi
cd ..

# Setup Terraform
echo ""
print_info "Setting up Terraform..."
cd infrastructure

if [ ! -f terraform.tfvars ]; then
    cp terraform.tfvars.example terraform.tfvars
    print_warning "Created terraform.tfvars"
    print_warning "IMPORTANT: Edit terraform.tfvars and change frontend_bucket_name!"
    echo ""
    read -p "Enter a unique bucket name suffix (e.g., your name-12345): " bucket_suffix
    sed -i.bak "s/YOUR-UNIQUE-ID/$bucket_suffix/g" terraform.tfvars
    rm terraform.tfvars.bak 2>/dev/null || true
    print_success "Updated bucket name to: todo-app-frontend-$bucket_suffix"
fi

echo ""
print_info "Initializing Terraform..."
terraform init
print_success "Terraform initialized"

echo ""
print_warning "Ready to deploy infrastructure!"
print_info "This will create AWS resources (DynamoDB, Lambda, S3, CloudFront, etc.)"
print_info "Estimated time: 5-8 minutes"
echo ""
read -p "Deploy infrastructure now? (yes/no): " deploy_now

if [ "$deploy_now" = "yes" ]; then
    echo ""
    print_info "Running terraform plan..."
    terraform plan
    
    echo ""
    print_info "Applying infrastructure..."
    terraform apply -auto-approve
    
    print_success "Infrastructure deployed!"
    
    # Save outputs
    terraform output > ../deployment-outputs.txt
    
    # Get API URL
    API_URL=$(terraform output -raw api_endpoint)
    BUCKET_NAME=$(terraform output -raw frontend_bucket_name)
    CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
    FRONTEND_URL=$(terraform output -raw frontend_url)
    
    echo ""
    print_success "Deployment complete!"
    echo ""
    echo "📊 Your URLs:"
    echo "  Frontend: $FRONTEND_URL"
    echo "  API: $API_URL"
    echo ""
    
    # Deploy frontend
    print_info "Deploying frontend..."
    cd ../frontend
    
    echo "VITE_API_URL=$API_URL" > .env.production
    print_success "Configured frontend with API URL"
    
    print_info "Building frontend..."
    npm run build
    print_success "Frontend built"
    
    print_info "Uploading to S3..."
    aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete
    print_success "Frontend uploaded to S3"
    
    print_info "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" > /dev/null
    print_success "CloudFront cache invalidated"
    
    cd ..
    
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "=================================="
    echo ""
    echo "✅ Your application is live!"
    echo ""
    echo "🌐 Frontend URL: $FRONTEND_URL"
    echo "🔌 API URL: $API_URL"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Open the frontend URL in your browser"
    echo "  2. Test adding/completing/deleting tasks"
    echo "  3. Setup GitHub Secrets for CI/CD:"
    echo "     - Go to: https://github.com/YOUR-USERNAME/YOUR-REPO/settings/secrets/actions"
    echo "     - Add: AWS_ACCESS_KEY_ID"
    echo "     - Add: AWS_SECRET_ACCESS_KEY"
    echo "     - Add: AWS_REGION (value: us-east-1)"
    echo "  4. Read DEMO_CHECKLIST.md to prepare your presentation"
    echo ""
    echo "📊 View logs:"
    echo "  aws logs tail /aws/lambda/todo-api-function --follow"
    echo ""
    echo "🗑️  To delete everything later:"
    echo "  cd infrastructure && terraform destroy"
    echo ""
else
    echo ""
    print_info "Skipping deployment for now."
    print_info "When ready, run:"
    echo "  cd infrastructure"
    echo "  terraform apply"
    cd ..
fi

echo ""
print_success "Setup complete!"
