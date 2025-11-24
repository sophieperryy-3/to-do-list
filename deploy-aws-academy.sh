#!/bin/bash

# Simplified Deployment for AWS Academy/Learner Lab
# Works with restricted IAM permissions

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "${BLUE}━━━ $1 ━━━${NC}"; }

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     AWS Academy Deployment (Simplified)                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_step "Step 1: Installing Backend Dependencies"
cd backend
npm install
print_success "Backend dependencies installed"

print_step "Step 2: Building Backend"
npm run build
print_success "Backend built"
cd ..

print_step "Step 3: Installing Frontend Dependencies"
cd frontend
npm install
print_success "Frontend dependencies installed"
cd ..

print_step "Step 4: Deploying Infrastructure (DynamoDB + S3)"
cd infrastructure-simple

if [ ! -f terraform.tfvars ]; then
    echo 'aws_region = "us-east-1"' > terraform.tfvars
    echo 'dynamodb_table_name = "todo-tasks-simple"' >> terraform.tfvars
    RANDOM_SUFFIX=$(date +%s | tail -c 6)
    echo "frontend_bucket_name = \"todo-frontend-sophie-$RANDOM_SUFFIX\"" >> terraform.tfvars
fi

terraform init
terraform apply -auto-approve

TABLE_NAME=$(terraform output -raw dynamodb_table_name)
BUCKET_NAME=$(terraform output -raw frontend_bucket_name)
FRONTEND_URL=$(terraform output -raw frontend_url)

cd ..

print_step "Step 5: Building Frontend (with local API)"
cd frontend
echo "VITE_API_URL=http://localhost:3000" > .env.production
npm run build
print_success "Frontend built"

print_step "Step 6: Deploying Frontend to S3"
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete
print_success "Frontend deployed"

cd ..

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🎉 DEPLOYMENT COMPLETE! 🎉                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}📊 Your Setup:${NC}"
echo -e "   🌐 Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo -e "   🗄️  DynamoDB: ${GREEN}$TABLE_NAME${NC}"
echo ""
echo -e "${YELLOW}⚠️  AWS Academy Limitation:${NC}"
echo "   AWS Academy doesn't allow Lambda/IAM role creation."
echo "   So we'll run the backend LOCALLY on your computer."
echo ""
echo -e "${BLUE}📝 To Start Your App:${NC}"
echo ""
echo "   1. Open a NEW terminal and run the backend:"
echo -e "      ${GREEN}cd backend${NC}"
echo -e "      ${GREEN}export DYNAMODB_TABLE_NAME=$TABLE_NAME${NC}"
echo -e "      ${GREEN}export AWS_REGION=us-east-1${NC}"
echo -e "      ${GREEN}npm run dev${NC}"
echo ""
echo "   2. Open your frontend URL in a browser:"
echo -e "      ${GREEN}$FRONTEND_URL${NC}"
echo ""
echo "   3. Test your app!"
echo ""
echo -e "${BLUE}💡 For Your Demo:${NC}"
echo "   - Show the code (backend + frontend)"
echo "   - Show the Terraform infrastructure (DynamoDB + S3)"
echo "   - Show the GitHub repo with CI/CD workflows"
echo "   - Explain that Lambda would be used in production"
echo "   - Run the app live during demo"
echo ""
print_success "Ready for your demo!"
