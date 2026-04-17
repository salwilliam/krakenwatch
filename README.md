# Kraken Watch

Kraken Watch is a Vite + React site deployed to Cloudflare.

## Production deployment source of truth

- **Canonical production target:** Cloudflare Workers service `wispy-sun-811e`
- **Deploy trigger:** push/merge to `main` (GitHub Actions workflow: `Deploy to Cloudflare Workers`)
- **Custom domain:** `krakenwatch.com` should resolve to the canonical Workers deployment

## Deploy workflow summary

1. `npm ci`
2. `npm run build`
3. strip Pages-only redirect artifact (`dist/_redirects`) before Workers upload
4. deploy with:
   - `npx wrangler@latest deploy --config wrangler.workers.toml`

### Why `dist/_redirects` is removed

`_redirects` is a Cloudflare Pages file and can cause Workers deploy failures
(`Invalid _redirects configuration`, code `10021`) if uploaded as an asset.

## Operational guardrails

- Do not switch deploy target between Pages and Workers without a dedicated migration PR.
- Do not keep multiple production-capable domain bindings active for the same hostname.
- Always verify post-deploy asset hashes on:
  - `https://krakenwatch.com/`
  - `https://wispy-sun-811e.krakenwatch.workers.dev/`
  They should match when production is healthy.

## Incident quick checks

If the site looks wrong:

1. Check latest workflow run status in GitHub Actions.
2. Compare asset hashes between production and canonical worker domain.
3. Confirm route responses (`/`, `/ink`, `/payward`, `/alpha-briefs`) are HTTP `200`.
4. Purge Cloudflare cache only **after** confirming deploy target/domain routing are correct.

## Local development

Install deps and run the app:

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```
