# Infrastructure as Code (Terraform)

This directory contains Terraform configuration to provision all AWS resources for the To-Do application.

## 🏗️ Resources Provisioned

### Compute & API
- **AWS Lambda**: Serverless function running Express.js API
- **API Gateway HTTP API**: HTTP endpoints triggering Lambda
- **CloudWatch Log Groups**: Centralized logging

### Storage
- **DynamoDB Table**: NoSQL database for tasks (on-demand billing)
- **S3 Bucket**: Static website hosting for React frontend

### CDN & Networking
- **CloudFront Distribution**: Global CDN for frontend
- **CloudFront OAI**: Secure access to private S3 bucket

### Security & IAM
- **Lambda Execution Role**: Least-privilege IAM role
- **IAM Policies**: Scoped access to DynamoDB and CloudWatch
- **S3 Bucket Policy**: CloudFront-only access

## 📋 Prerequisites

1. **Terraform** 1.5+ installed
   ```bash
   terraform version
   ```

2. **AWS CLI** configured with credentials
   ```bash
   aws configure
   # Enter your AWS Access Key ID and Secret Access Key
   ```

3. **Backend built** (Lambda deployment package)
   ```bash
   cd ../backend
   npm install
   npm run build
   ```

## 🚀 Deployment Steps

### 1. Initialize Terraform

```bash
cd infrastructure
terraform init
```

This downloads required providers (AWS, Archive).

### 2. Configure Variables

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

**Important**: Change `frontend_bucket_name` to ensure global uniqueness!

### 3. Plan Infrastructure Changes

```bash
terraform plan
```

Review the resources that will be created. Terraform will show:
- ✅ Resources to create (green +)
- ⚠️ Resources to modify (yellow ~)
- ❌ Resources to destroy (red -)

### 4. Apply Infrastructure

```bash
terraform apply
```

Type `yes` to confirm. This takes 2-5 minutes.

### 5. Note the Outputs

After successful deployment, Terraform outputs:
- `api_endpoint` - Backend API URL
- `frontend_url` - CloudFront URL
- `dynamodb_table_name` - DynamoDB table name
- `frontend_bucket_name` - S3 bucket name
- `cloudfront_distribution_id` - For cache invalidation

Save these values for deployment!

## 🔄 Updating Infrastructure

When you change Terraform files:

```bash
terraform plan   # Review changes
terraform apply  # Apply changes
```

Terraform tracks state and only modifies what changed.

## 🗑️ Destroying Infrastructure

To delete all resources (e.g., after demo):

```bash
terraform destroy
```

**Warning**: This permanently deletes all data!

## 📁 File Structure

```
infrastructure/
├── main.tf              # Provider configuration
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── dynamodb.tf          # DynamoDB table
├── lambda.tf            # Lambda function + IAM
├── api-gateway.tf       # API Gateway HTTP API
├── s3-frontend.tf       # S3 bucket for frontend
├── cloudfront.tf        # CloudFront CDN
├── terraform.tfvars     # Variable values (gitignored)
└── README.md            # This file
```

## 🔐 Security Best Practices

### Secrets Management
- ❌ Never commit `terraform.tfvars` with secrets
- ✅ Use environment variables or AWS Secrets Manager
- ✅ Use IAM roles instead of access keys when possible

### Least Privilege IAM
- Lambda role has minimal permissions:
  - Read/write only to specific DynamoDB table
  - Write logs only to specific CloudWatch log group

### Encryption
- ✅ DynamoDB encryption at rest (enabled)
- ✅ S3 encryption at rest (AES256)
- ✅ CloudFront enforces HTTPS
- ✅ API Gateway uses TLS 1.2+

## 🔧 Troubleshooting

### Error: S3 bucket name already exists
**Solution**: Change `frontend_bucket_name` in `terraform.tfvars` to a unique value.

### Error: Lambda deployment package not found
**Solution**: Build the backend first:
```bash
cd ../backend
npm install
npm run build
cd ../infrastructure
terraform apply
```

### Error: AWS credentials not found
**Solution**: Configure AWS CLI:
```bash
aws configure
```

### Lambda function not updating
**Solution**: Terraform detects changes via `source_code_hash`. Rebuild backend:
```bash
cd ../backend
npm run build
cd ../infrastructure
terraform apply
```

## 📊 Cost Estimation

Estimated monthly costs (low traffic):
- **Lambda**: $0 (1M free requests/month)
- **API Gateway**: $1-5 (1M requests)
- **DynamoDB**: $1-5 (on-demand, low usage)
- **S3**: $0.50 (storage + requests)
- **CloudFront**: $1-5 (data transfer)

**Total**: ~$5-15/month for demo usage

Free tier covers most costs for first 12 months!

## 🎯 DevOps Best Practices Demonstrated

1. ✅ **Infrastructure as Code**: All resources version-controlled
2. ✅ **Declarative Configuration**: Terraform manages desired state
3. ✅ **Idempotency**: Can run `terraform apply` multiple times safely
4. ✅ **Documentation**: Inline comments explain every resource
5. ✅ **Modularity**: Resources split into logical files
6. ✅ **Outputs**: Important values exported for CI/CD
7. ✅ **Security**: Least privilege IAM, encryption, HTTPS

## 📚 Additional Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [CloudFront Security](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/security.html)
