# Terraform Remote Backend Bootstrap Process

## Overview
This document explains the correct two-step process to bootstrap Terraform remote state management with S3 backend and DynamoDB locking.

## Why Bootstrap is Needed
- **Chicken-and-egg problem**: We need S3 bucket and DynamoDB table to store remote state, but we need Terraform to create them
- **Solution**: Create backend infrastructure with local state first, then migrate to remote state

## Prerequisites
- AWS credentials configured (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
- Terraform >= 1.5.0 installed
- Proper AWS permissions for S3 and DynamoDB

## Step-by-Step Bootstrap Process

### Step 1: Create Backend Infrastructure (Local State)

First, we create the S3 bucket and DynamoDB table using local state:

```bash
cd infrastructure-simple

# Ensure backend.tf is commented out or renamed temporarily
# This prevents Terraform from trying to use remote backend before it exists
mv backend.tf backend.tf.disabled

# Initialize with local state
terraform init

# Create only the backend infrastructure resources
terraform apply -target=aws_s3_bucket.terraform_state
terraform apply -target=aws_s3_bucket_versioning.terraform_state
terraform apply -target=aws_s3_bucket_server_side_encryption_configuration.terraform_state
terraform apply -target=aws_s3_bucket_public_access_block.terraform_state
terraform apply -target=aws_dynamodb_table.terraform_state_lock

# Verify backend resources are created
aws s3 ls | grep terraform-state-sophie-devops-98633
aws dynamodb list-tables | grep terraform-state-lock
```

### Step 2: Migrate to Remote Backend

Now that the backend infrastructure exists, we can migrate to remote state:

```bash
# Re-enable the backend configuration
mv backend.tf.disabled backend.tf

# Re-initialize Terraform with backend configuration
# Terraform will detect the backend change and prompt for migration
terraform init

# When prompted: "Do you want to copy existing state to the new backend?"
# Answer: yes

# Verify migration was successful
terraform plan
```

### Step 3: Verify Remote State is Working

```bash
# Check that state file exists in S3
aws s3 ls s3://terraform-state-sophie-devops-98633/state/

# Verify state locking works by running a plan (should acquire lock)
terraform plan

# Check DynamoDB for lock entries (during terraform operations)
aws dynamodb scan --table-name terraform-state-lock
```

### Step 4: Clean Up Local State Files

```bash
# Remove local state files (they're now in S3)
rm terraform.tfstate*

# Verify no local state remains
ls -la terraform.tfstate*  # Should show "No such file or directory"
```

## Verification Commands

### Verify S3 Backend
```bash
# List state file in S3
aws s3 ls s3://terraform-state-sophie-devops-98633/state/ --recursive

# Download and inspect state (optional)
aws s3 cp s3://terraform-state-sophie-devops-98633/state/terraform.tfstate ./temp-state.json
cat temp-state.json | jq '.version'
rm temp-state.json
```

### Verify DynamoDB Locking
```bash
# Check lock table structure
aws dynamodb describe-table --table-name terraform-state-lock

# Monitor locks during terraform operations
# (Run this in another terminal while running terraform plan/apply)
watch -n 1 'aws dynamodb scan --table-name terraform-state-lock --query "Items[*].{LockID:LockID.S,Info:Info.S}"'
```

### Test State Locking
```bash
# Terminal 1: Start a long-running operation
terraform plan -detailed-exitcode

# Terminal 2: Try to run another operation (should be blocked)
terraform plan  # Should show "Error acquiring the state lock"
```

## Troubleshooting

### State Lock Issues
```bash
# If state gets stuck locked, find the lock ID
aws dynamodb scan --table-name terraform-state-lock

# Force unlock (use carefully!)
terraform force-unlock <LOCK_ID>
```

### Backend Migration Issues
```bash
# If migration fails, you can retry
terraform init -migrate-state

# Or reconfigure backend
terraform init -reconfigure
```

### State File Recovery
```bash
# List all versions of state file
aws s3api list-object-versions --bucket terraform-state-sophie-devops-98633 --prefix state/terraform.tfstate

# Restore specific version if needed
aws s3api get-object --bucket terraform-state-sophie-devops-98633 --key state/terraform.tfstate --version-id <VERSION_ID> restored-state.tfstate
```

## Security Considerations

### Access Control
- S3 bucket has public access blocked
- DynamoDB table uses least-privilege access
- State files are encrypted at rest (AES-256)

### Backup Strategy
- S3 versioning enabled for state history
- Cross-region replication can be added for DR
- Regular state backups recommended

## Cost Implications

### S3 Costs
- Storage: ~$0.023/GB/month (minimal for state files)
- Requests: ~$0.0004/1000 requests
- Versioning: Additional storage for historical versions

### DynamoDB Costs
- Pay-per-request billing: ~$1.25/million requests
- Storage: ~$0.25/GB/month
- Typical usage: <$1/month for small teams

## Team Collaboration Benefits

Once bootstrapped, your team gets:

✅ **Shared State**: All team members work from the same state  
✅ **State Locking**: Prevents concurrent modifications and corruption  
✅ **Audit Trail**: Complete history of infrastructure changes  
✅ **Security**: Encrypted state with proper access controls  
✅ **Backup**: Versioned state files for disaster recovery  
✅ **CI/CD Ready**: GitHub Actions can validate against shared state  

## Next Steps

After successful bootstrap:
1. Update team documentation with backend configuration
2. Ensure all team members run `terraform init` to use remote backend
3. Update CI/CD pipelines to use remote state
4. Set up monitoring and alerting for backend resources
5. Implement backup and disaster recovery procedures