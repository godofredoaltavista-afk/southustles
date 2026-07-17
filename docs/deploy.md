# Deploy — South Hustles

Static site (`app/`), deployed to an S3 static website behind CloudFront, provisioned by
Terraform (`infra/`). Same pattern as [mini-release-platform](https://github.com/leop27/mini-release-platform).

**Live:**
- CloudFront (HTTPS, use this one — works on mobile/carriers that force HTTPS): https://d2ewbctayp91bl.cloudfront.net
- S3 website endpoint (HTTP only, kept for debugging): http://south-hustles-prod.s3-website-us-east-1.amazonaws.com

## The flow — every change is a PR Franco approves

1. Work locally on a branch, push it, open a PR against `main`.
2. **`.github/workflows/ci.yml`** runs automatically on the PR: validates the repo structure,
   builds the `app/` Docker image, runs it, smoke-tests it over HTTP, and checks the Terraform
   files (`fmt -check` + `validate`, no AWS credentials needed — nothing is applied).
3. Franco reviews the diff and the CI result, then **merges the PR himself**. Nothing deploys
   before that merge.
4. **`.github/workflows/deploy.yml`** runs only on push to `main`: repeats the same validation,
   then syncs `app/` to the S3 bucket (`aws s3 sync app/ s3://$S3_BUCKET/ --delete`).

No step in CI ever runs `terraform apply` — deploy.yml only ever runs `aws s3 sync`. CloudFront
was provisioned once, locally, by hand (see below), never from a GitHub Actions runner.

## What's actually provisioned (as of 2026-07-17)

- **S3 bucket** `south-hustles-prod` (`us-east-1`) — created **by hand** in the AWS console
  (Create bucket → uncheck "Block all public access" → Properties → enable static website
  hosting, index document `index.html` → Permissions → public-read bucket policy). Terraform
  does **not** manage the bucket — `infra/main.tf` only has a `data "aws_s3_bucket"` read-only
  reference to it (`var.bucket_name`, default `south-hustles-prod`), specifically so `terraform
  apply` can never recreate or delete it.
- **CloudFront distribution** `d2ewbctayp91bl.cloudfront.net` — the one resource Terraform
  actually creates (`aws_cloudfront_distribution.site_cdn`), origin = the S3 website endpoint,
  `origin_protocol_policy = "http-only"` (S3 website endpoints never speak HTTPS — this is the
  fix for mobile browsers/carriers that force `https://` and got nothing but a connection
  timeout against the bare S3 endpoint). Free default `*.cloudfront.net` certificate.
- **IAM user** `south-hustles-ci` — has `AmazonS3FullAccess` (used by `deploy.yml`'s `aws s3
  sync`) **and** `CloudFrontFullAccess` (needed once, for the `terraform apply` above; not used
  by any CI workflow — only `s3 sync` runs in CI). Consider splitting this into two users
  (CI-only vs. one-time-infra) if that scope bothers you later; not urgent for a personal
  project.

## Re-running the CloudFront apply (e.g. after editing `infra/main.tf`)

```bash
cd infra
terraform init      # needs AWS credentials configured locally (aws configure) — never in chat
terraform plan       # review: should show 0 changes to the bucket, only CloudFront diffs
terraform apply
terraform output cloudfront_domain_name
```

Terraform state is **local-only** (`infra/terraform.tfstate`, gitignored) — it lives on whichever
machine ran `apply`. If that's lost, Terraform loses track of the CloudFront distribution and a
fresh `apply` would try to create a second one; `terraform import` can reattach it if that
happens. Migrating to a remote backend (e.g. an S3 state bucket) is a reasonable future step, not
done yet.

## Repo secrets (already set)

`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (the `south-hustles-ci` user above) / `AWS_REGION`
(`us-east-1`) / `S3_BUCKET` (`south-hustles-prod`) — GitHub repo → Settings → Secrets and
variables → Actions. From here: merge a PR → `deploy.yml` syncs `app/` to the bucket, CloudFront
serves the updated files (may take a few minutes to invalidate cached objects at edge — CloudFront
caching isn't configured with short TTLs yet).

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
