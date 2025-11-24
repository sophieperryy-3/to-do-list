#!/bin/bash

# Complete Automated Deployment Script
# This will deploy your entire DevOps To-Do application

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     DevOps To-Do App - Automated Deployment Script        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print colored output
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "${BLUE}━━━ $1 ━━━${NC}"; }

# Check prerequisites
print_step "Checking Prerequisites"

if ! command -v node &> /dev/null; then
    print_error "Node.js not found! Install from: https://nodejs.org/"
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm not found!"
    exit 1
fi
print_success "npm found: $(npm --version)"

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found! Install from: https://aws.amazon.com/cli/"
    exit 1
fi
print_success "AWS CLI found"

if ! command -v terraform &> /dev/null; then
    print_error "Terraform not found! Install from: https://www.terraform.io/downloads"
    exit 1
fi
print_success "Terraform found: $(terraform --version | head -n 1)"

# Check AWS credentials
print_step "Checking AWS Credentials"
if aws sts get-caller-identity &> /dev/null; then
    print_success "AWS credentials configured"
    aws sts get-caller-identity
else
    print_error "AWS credentials not configured!"
    print_info "Run: aws configure"
    exit 1
fi

echo ""
print_step "Step 1: Installing Backend Dependencies"
cd backend
if [ ! -d node_modules ]; then
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

print_step "Step 2: Building Backend"
npm run build
print_success "Backend built successfully"
cd ..

echo ""
print_step "Step 3: Installing Frontend Dependencies"
cd frontend
if [ ! -d node_modules ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi
cd ..

echo ""
print_step "Step 4: Configuring Terraform"
cd infrastructure

if [ ! -f terraform.tfvars ]; then
    cp terraform.tfvars.example terraform.tfvars
    
    # Generate unique bucket name
    RANDOM_SUFFIX=$(date +%s | tail -c 6)
    sed -i.bak "s/YOUR-UNIQUE-ID/sophie-$RANDOM_SUFFIX/g" terraform.tfvars
    rm -f terraform.tfvars.bak
    
    print_success "Created terraform.tfvars with unique bucket name"
    print_info "Bucket name: todo-app-frontend-sophie-$RANDOM_SUFFIX"
else
    print_success "terraform.tfvars already exists"
fi

echo ""
print_step "Step 5: Initializing Terraform"
terraform init
print_success "Terraform initialized"

echo ""
print_step "Step 6: Deploying Infrastructure (This takes 5-8 minutes)"
print_warning "Creating: DynamoDB, Lambda, API Gateway, S3, CloudFront, IAM roles..."
terraform apply -auto-approve

print_success "Infrastructure deployed!"

# Save outputs
terraform output > ../deployment-outputs.txt

# Get outputs
API_URL=$(terraform output -raw api_endpoint)
BUCKET_NAME=$(terraform output -raw frontend_bucket_name)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
FRONTEND_URL=$(terraform output -raw frontend_url)

echo ""
print_step "Step 7: Deploying Frontend"
cd ../frontend

# Configure with API URL
echo "VITE_API_URL=$API_URL" > .env.production
print_success "Configured frontend with API URL"

# Build
print_info "Building frontend..."
npm run build
print_success "Frontend built"

# Deploy to S3
print_info "Uploading to S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete
print_success "Frontend uploaded to S3"

# Invalidate CloudFront cache
print_info "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" > /dev/null
print_success "CloudFront cache invalidated"

cd ..

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🎉 DEPLOYMENT COMPLETE! 🎉                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${GREEN}✅ Your application is LIVE!${NC}"
echo ""
echo -e "${BLUE}📊 Your URLs:${NC}"
echo -e "   🌐 Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo -e "   🔌 API:      ${GREEN}$API_URL${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "   1. Open the frontend URL in your browser"
echo "   2. Test adding/completing/deleting tasks"
echo "   3. Setup GitHub Secrets for CI/CD:"
echo "      → Go to: https://github.com/sophieperryy-3/todolist/settings/secrets/actions"
echo "      → Add: AWS_ACCESS_KEY_ID"
echo "      → Add: AWS_SECRET_ACCESS_KEY"
echo "      → Add: AWS_REGION (value: us-east-1)"
echo ""
echo -e "${BLUE}📊 Useful Commands:${NC}"
echo "   View logs:    aws logs tail /aws/lambda/todo-api-function --follow"
echo "   Test API:     curl $API_URL/health"
echo "   Destroy all:  cd infrastructure && terraform destroy"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   Demo prep:    Read DEMO_CHECKLIST.md"
echo "   Architecture: Read ARCHITECTURE.md"
echo "   Full guide:   Read DEPLOYMENT_GUIDE.md"
echo ""
print_success "All outputs saved to: deployment-outputs.txt"
echo ""

# Test API
print_step "Testing API Health"
sleep 5  # Wait a moment for Lambda to be ready
if curl -s "$API_URL/health" | grep -q "healthy"; then
    print_success "API is responding correctly!"
else
    print_warning "API might still be warming up. Try again in a minute."
fi

echo ""
echo -e "${GREEN}🚀 Your DevOps To-Do app is ready for your demo!${NC}"
echo ""
