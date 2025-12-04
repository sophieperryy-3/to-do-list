#!/bin/bash
# Deploy Lambda function

set -e

echo "🏗️  Building backend..."
npm run build

echo "📦 Creating Lambda deployment package..."
cd dist
zip -r ../lambda-deployment.zip . > /dev/null
cd ..

echo "📦 Adding node_modules..."
zip -r lambda-deployment.zip node_modules > /dev/null

echo "✅ Lambda package created: lambda-deployment.zip"
echo "📦 Package size: $(du -h lambda-deployment.zip | cut -f1)"

# Copy to infrastructure directory for Terraform
cp lambda-deployment.zip ../infrastructure-simple/

echo "✅ Ready for Terraform deployment!"
