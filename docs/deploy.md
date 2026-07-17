# Deploy — South Hustles

Static site (`app/`), deployed to an S3 static website behind CloudFront, provisioned by
Terraform (`infra/`). Same pattern as [mini-release-platform](https://github.com/leop27/mini-release-platform).

## The flow — every change is a PR Franco approves

1. Work locally on a branch, push it, open a PR against `main`.
2. **`.github/workflows/ci.yml`** runs automatically on the PR: validates the repo structure,
   builds the `app/` Docker image, runs it, smoke-tests it over HTTP, and checks the Terraform
   files (`fmt -check` + `validate`, no AWS credentials needed — nothing is applied).
3. Franco reviews the diff and the CI result, then **merges the PR himself**. Nothing deploys
   before that merge.
4. **`.github/workflows/deploy.yml`** runs only on push to `main`: repeats the same validation,
   then syncs `app/` to the S3 bucket (`aws s3 sync app/ s3://$S3_BUCKET/ --delete`).

No step in CI ever runs `terraform apply` — the AWS infrastructure is provisioned once, by hand,
outside the pipeline. This keeps the GitHub Actions AWS credentials scoped to `s3:PutObject` /
`s3:DeleteObject` only, never `s3:CreateBucket` or CloudFront/IAM changes.

## One-time setup (before the first real deploy)

1. **Provision the infrastructure** — from `infra/`, with AWS credentials configured locally:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```
   This creates the S3 bucket (unique-suffixed), enables static website hosting, makes it
   publicly readable, and puts a CloudFront distribution in front of it.
2. **Read the outputs**:
   ```bash
   terraform output bucket_name
   terraform output cloudfront_domain_name
   ```
3. **Add repo secrets** — GitHub repo → Settings → Secrets and variables → Actions:
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — an IAM user scoped to that one bucket
   - `AWS_REGION` — matches `infra/variables.tf`'s `aws_region` (default `us-east-1`)
   - `S3_BUCKET` — the `bucket_name` output above
4. From then on: merge a PR → `deploy.yml` syncs `app/` to that bucket automatically.

## Custom domain (southhustles.com)

Not wired yet — `infra/main.tf` has a note where an ACM certificate + Route53 alias +
CloudFront alternate domain name slot in as a small, additive Terraform change, once the
domain is ready to point here.

## Local preview

```bash
cd app && ./serve.sh        # http://localhost:8080 (python http.server)
# or, to match CI exactly:
docker build -t south-hustles ./app && docker run -p 8080:80 south-hustles
```
