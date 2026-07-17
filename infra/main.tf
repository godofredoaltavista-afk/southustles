terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# The S3 bucket, static website hosting, and public bucket policy were
# already created by hand in the AWS console (south-hustles-prod, us-east-1)
# — referenced here read-only so CloudFront can point at it. Terraform
# never creates, modifies, or deletes the bucket itself.
data "aws_s3_bucket" "site_bucket" {
  bucket = var.bucket_name
}

resource "aws_cloudfront_distribution" "site_cdn" {
  enabled             = true
  comment             = "${var.project_name}-${var.environment} CDN"
  default_root_object = "index.html"

  origin {
    # aws_s3_bucket data source exposes website_endpoint directly once the
    # bucket has static website hosting enabled — no separate data source
    # needed (aws_s3_bucket_website_configuration has no `data` variant).
    domain_name = data.aws_s3_bucket.site_bucket.website_endpoint
    origin_id   = "s3-website-${data.aws_s3_bucket.site_bucket.id}"

    # S3 website endpoints only ever speak plain HTTP — CloudFront is what
    # terminates HTTPS for visitors (this is the fix for phones/carriers
    # that force https:// and got nothing but a connection timeout).
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "s3-website-${data.aws_s3_bucket.site_bucket.id}"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    # Free *.cloudfront.net cert, works immediately — no domain validation
    # wait. Swap for an ACM cert (us-east-1, required) once southhustles.com
    # is ready to alias here.
    cloudfront_default_certificate = true
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "FrancoAltavista"
  }
}

# Only the CloudFront layer is managed here. The S3 bucket itself (name,
# static website hosting, public bucket policy) was provisioned by hand in
# the AWS console and stays that way — `terraform apply` only ever creates
# the CloudFront distribution on top of it. A custom domain
# (southhustles.com) + ACM cert (us-east-1) + Route53 alias can be added
# later as a small, additive change to this same distribution.
