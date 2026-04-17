# Deployment Runbook (Workers Canonical)

This project now uses a **single production deployment path**:

- Cloudflare Workers service: `wispy-sun-811e`
- Custom domain: `krakenwatch.com`

## Source of truth

- Production assets are served from `dist/` via Workers static assets.
- Deploy workflow: `.github/workflows/deploy.yml`.

## Critical rules

1. Do not route `krakenwatch.com` to a second production project.
2. Do not upload Pages `_redirects` into Workers assets.
3. Keep only one production-capable domain binding active.

## Deploy checks

After each merge:

1. Verify workflow success (`Deploy to Cloudflare Workers`).
2. Verify hashes on:
   - `https://krakenwatch.com/`
   - `https://wispy-sun-811e.krakenwatch.workers.dev/`
3. Verify routes return `200`:
   - `/`
   - `/ink`
   - `/payward`
   - `/alpha-briefs`

## Cloudflare cleanup target

Once stable:

- Keep `wispy-sun-811e` as canonical production target.
- Remove or disable production domain routing on the Pages project to prevent split deployments.
