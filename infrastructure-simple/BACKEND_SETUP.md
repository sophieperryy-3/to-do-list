# Terraform Remote Backend Setup

## Overview
This guide sets up remote state management for team collaboration and state locking.

## Why Remote Backend?

### Problems with Local State:
❌ **No team collaboration** - State files on individual machines  
❌ **No state locking** - Multiple people can corrupt state  
❌ **Security risk** - Sensitive data in local files  
❌ **No backup** - State loss = infrastructure loss  

### Benefits of Remote Backend:
✅ **Team collaboration** - Shared state in S3  
✅ **State locking** - DynamoDB prevents concurrent modifications  
✅ **Security** - Encrypted state storage  
✅ **Backup** - S3 versioning for state history  
✅ **Audit trail** - Who changed what when  

## Setup Steps

### Step 1: Create Backend Infrastructure

First, we need to create the S3 bucket and DynamoDB table for the backend:

```bash
cd infrastructure-simple

# Temporarily comment out the backend block in main.tf
# (Lines with backend "s3" { ... })

# Apply backend infrastructure
terraform init
terraform apply -target=aws_s3_bucket.terraform_state
terraform apply -target=aws_dynamodb_table.terraform_state_lock
terraform apply -target=aws_s3_bucket_versioning.terraform_state
terraform apply -target=aws_s3_bucket_server_side_encryption_configuration.terraform_state
terraform apply -target=aws_s3_bucket_public_access_block.terraform_state
```

### Step 2: Migrate to Remote Backend

```bash
# Uncomment the backend block in main.tf
# Re-initialize with backend
terraform init

# Terraform will ask: "Do you want to copy existing state to the new backend?"
# Answer: yes

# Verify remote state is working
terraform plan
```

### Step 3: Clean Up Local State

```bash
# Remove local state files (they're now in S3)
rm terraform.tfstate*
rm .terraform.lock.hcl

# Add to .gitignore to prevent future commits
echo "terraform.tfstate*" >> .gitignore
echo ".terraform.lock.hcl" >> .gitignore
```

### Step 4: Update CI/CD Pipeline

The Terraform CI workflow now:
- Uses remote backend for validation
- Generates plans against actual state
- Provides state locking during operations

## Team Collaboration Benefits

### State Locking
```bash
# When someone runs terraform apply:
# 1. DynamoDB lock acquired
# 2. State file locked in S3
# 3. Other team members get "state locked" error
# 4. Lock released when operation completes
```

### Shared State
```bash
# All team members see the same infrastructure state
terraform show  # Shows current state from S3
terraform plan  # Plans against shared state
```

### Audit Trail
```bash
# S3 versioning tracks all state changes
aws s3api list-object-versions \
  --bucket terraform-state-sophie-devops-98633 \
  --prefix todo-app/terraform.tfstate
```

## Security Features

### Encryption
- **S3**: Server-side encryption (AES-256)
- **DynamoDB**: Encryption at rest enabled
- **Transit**: All AWS API calls use HTTPS

### Access Control
- **S3 bucket**: Public access blocked
- **IAM roles**: Least privilege access
- **State locking**: Prevents concurrent modifications

### Backup & Recovery
- **S3 versioning**: Complete state history
- **Cross-region replication**: (Can be added for DR)
- **Point-in-time recovery**: Restore any previous state

## Monitoring & Alerting

### CloudWatch Metrics
- S3 bucket access patterns
- DynamoDB lock table usage
- Failed state operations

### Recommended Alarms
```bash
# Alert on state lock table errors
aws cloudwatch put-metric-alarm \
  --alarm-name "terraform-state-lock-errors" \
  --alarm-description "Alert on DynamoDB errors" \
  --metric-name UserErrors \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold
```

## Troubleshooting

### State Lock Issues
```bash
# If state is stuck locked:
terraform force-unlock <LOCK_ID>

# Find lock ID in DynamoDB table
aws dynamodb scan --table-name terraform-state-lock
```

### State Corruption
```bash
# Restore from S3 version
aws s3api list-object-versions \
  --bucket terraform-state-sophie-devops-98633 \
  --prefix todo-app/terraform.tfstate

# Download specific version
aws s3api get-object \
  --bucket terraform-state-sophie-devops-98633 \
  --key todo-app/terraform.tfstate \
  --version-id <VERSION_ID> \
  terraform.tfstate
```

## Cost Considerations

### S3 Costs
- **Storage**: ~$0.023/GB/month (minimal for state files)
- **Requests**: ~$0.0004/1000 requests
- **Versioning**: Additional storage for old versions

### DynamoDB Costs
- **Pay-per-request**: ~$1.25/million requests
- **Storage**: ~$0.25/GB/month
- **Typical usage**: <$1/month for small teams

## Best Practices

### 1. Separate Backends per Environment
```hcl
# Production
backend "s3" {
  bucket = "terraform-state-prod-98633"
  key    = "todo-app/terraform.tfstate"
}

# Staging
backend "s3" {
  bucket = "terraform-state-staging-98633"
  key    = "todo-app/terraform.tfstate"
}
```

### 2. State File Naming
```hcl
# Use descriptive keys
key = "project/environment/component/terraform.tfstate"
key = "todo-app/prod/infrastructure/terraform.tfstate"
```

### 3. Access Control
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::ACCOUNT:role/TerraformRole"},
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::terraform-state-*/todo-app/*"
    }
  ]
}
```

### 4. Backup Strategy
- Enable S3 versioning (✅ Already done)
- Set lifecycle policies for old versions
- Consider cross-region replication for DR

## Conclusion

Remote backend with state locking is **essential** for:
- ✅ **Team collaboration**
- ✅ **Production safety**
- ✅ **Audit compliance**
- ✅ **Disaster recovery**

This transforms Terraform from a single-user tool into a team-ready, production-grade infrastructure management system.