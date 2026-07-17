output "bucket_name" {
  description = "Name of the S3 bucket hosting the static site."
  value       = aws_s3_bucket.site_bucket.id
}

output "website_endpoint" {
  description = "S3 static website hosting endpoint."
  value       = aws_s3_bucket_website_configuration.site_website.website_endpoint
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain — point southhustles.com here via a CNAME/ALIAS."
  value       = aws_cloudfront_distribution.site_cdn.domain_name
}
