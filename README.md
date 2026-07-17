# South Hustles — Creative Studio

Static rebuild of the South Hustles / Pamba Creative portfolio — vanilla HTML/CSS/JS, no build
step, deployed to AWS S3 + CloudFront via Terraform. Additive-only: built on top of Franco's own
reusable design system (`la-caravana-club`, `hustles`, `ant-on-mars-super-frontend`,
`apacheta-app`).

```
app/          the static site — this is what gets deployed
infra/        Terraform: S3 static website + CloudFront, provisioned once by hand
.github/      CI (runs on every PR) + deploy (runs on merge to main)
docs/         deploy.md — the full PR → merge → deploy flow
reference/    studied-but-unused source from Franco's other repos, kept for future reuse
```

See [`docs/deploy.md`](docs/deploy.md) for the deploy flow and one-time AWS setup.

## Local preview

```bash
cd app && ./serve.sh   # http://localhost:8080
```
