variable "project_name" {
  description = "Short, URL-safe name used to prefix all resources."
  type        = string
  default     = "south-hustles"
}

variable "environment" {
  description = "Deployment environment (e.g. prod, staging)."
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region the S3 bucket and its resources live in."
  type        = string
  default     = "us-east-1"
}
