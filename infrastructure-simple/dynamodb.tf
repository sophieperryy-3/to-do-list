# DynamoDB Table - Simplified (no encryption to avoid KMS issues)

resource "aws_dynamodb_table" "tasks" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "todo-tasks-table"
  }
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.tasks.name
}
