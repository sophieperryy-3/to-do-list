# DynamoDB Table for Task Storage
#
# Serverless NoSQL database with:
# - On-demand billing (pay per request)
# - Automatic scaling
# - Point-in-time recovery for data protection

resource "aws_dynamodb_table" "tasks" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST" # On-demand pricing, no capacity planning needed
  hash_key     = "id"              # Partition key

  attribute {
    name = "id"
    type = "S" # String type
  }

  # Enable point-in-time recovery for data protection
  point_in_time_recovery {
    enabled = true
  }

  # Enable server-side encryption
  server_side_encryption {
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-tasks-table"
  }
}

# Output the table name for use in Lambda environment variables
output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.tasks.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.tasks.arn
}
