# S3 Bucket for Frontend Static Hosting
#
# Hosts React build artifacts (HTML, JS, CSS)
# Served via CloudFront CDN

resource "aws_s3_bucket" "frontend" {
  bucket = "${var.frontend_bucket_name}-${data.aws_caller_identity.current.account_id}"
  # Add account ID to ensure global uniqueness

  tags = {
    Name = "${var.project_name}-frontend-bucket"
  }
}

# Block public access (CloudFront will access via OAI)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for rollback capability
resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudFront Origin Access Identity
# Allows CloudFront to access private S3 bucket
resource "aws_cloudfront_origin_access_identity" "frontend" {
  comment = "OAI for ${var.project_name} frontend"
}

# S3 bucket policy: Allow CloudFront OAI to read objects
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAI"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.frontend.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# Output S3 bucket details
output "frontend_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.frontend.arn
}
