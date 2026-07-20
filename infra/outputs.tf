output "bucket_name" {
  description = "Name of the S3 bucket hosting the static site (created by hand, referenced read-only)."
  value       = data.aws_s3_bucket.site_bucket.id
}

output "website_endpoint" {
  description = "S3 static website hosting endpoint (HTTP only — use cloudfront_domain_name for HTTPS)."
  value       = data.aws_s3_bucket.site_bucket.website_endpoint
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain — HTTPS entry point, and where southhustles.com will alias to later."
  value       = aws_cloudfront_distribution.site_cdn.domain_name
}
