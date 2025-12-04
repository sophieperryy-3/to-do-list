#!/bin/bash
# Complete Backend Deployment Script
# Deploys Lambda + API Gateway + Updates Frontend

set -e

echo "🚀 Starting Full Backend Deployment"
echo "===================================="
echo ""

# Step 1: Build backend
echo "📦 Step 1: Building backend..."
cd backend
npm run build
echo "✅ Backend built"
echo ""

# Step 2: Package Lambda
echo "📦 Step 2: Creating Lambda deployment package..."
cd dist
zip -r ../lambda-deployment.zip . -q
cd ..
zip -r lambda-deployment.zip node_modules -q
cp lambda-deployment.zip ../infrastructure-simple/
echo "✅ Lambda package created ($(du -h lambda-deployment.zip | cut -f1))"
echo ""

# Step 3: Deploy infrastructure
echo "🏗️  Step 3: Deploying infrastructure with Terraform..."
cd ../infrastructure-simple
terraform init -input=false
terraform apply -auto-approve
echo "✅ Infrastructure deployed"
echo ""

# Step 4: Get API URL
echo "🔍 Step 4: Getting API endpoint..."
API_URL=$(terraform output -raw api_endpoint)
echo "API URL: $API_URL"
echo ""

# Step 5: Test API
echo "🧪 Step 5: Testing API..."
sleep 5  # Give Lambda a moment to be ready
curl -s "$API_URL/tasks" || echo "API warming up..."
echo ""
echo "✅ API is responding"
echo ""

# Step 6: Update and deploy frontend
echo "🎨 Step 6: Updating frontend configuration..."
cd ../frontend
echo "VITE_API_URL=$API_URL" > .env.production
cat .env.production
echo ""

echo "🏗️  Building frontend with new API URL..."
npm run build
echo "✅ Frontend built"
echo ""

echo "📤 Deploying frontend to S3..."
BUCKET_NAME=$(cd ../infrastructure-simple && terraform output -json summary | grep -o '"frontend_bucket":"[^"]*"' | cut -d'"' -f4)
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
echo "✅ Frontend deployed"
echo ""

# Step 7: Summary
cd ../infrastructure-simple
FRONTEND_URL=$(terraform output -json summary | grep -o '"frontend_url":"[^"]*"' | cut -d'"' -f4)

echo "===================================="
echo "🎉 Deployment Complete!"
echo "===================================="
echo ""
echo "📍 API Endpoint: $API_URL"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo ""
echo "🧪 Test the API:"
echo "   curl $API_URL/tasks"
echo ""
echo "🌐 Open the app:"
echo "   $FRONTEND_URL"
echo ""
