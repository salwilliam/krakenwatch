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

## PR live preview workflow

To prevent accidental use of alternate/broken codepaths, PR previews now use the
same canonical good path as production.

Preview workflow:

- `.github/workflows/pr-preview.yml`
- GitHub Actions name: `PR Live Preview (Canonical Proxy)`

How it works:

1. On PR open/sync/reopen, CI validates canonical proxy invariants:
   - `src/worker.js` contains `url.hostname = '1d2a3088.krakenwatch.pages.dev';`
   - `wrangler.workers.toml` contains `run_worker_first = true`
2. CI smoke-checks canonical routes on:
   - `https://wispy-sun-811e.krakenwatch.workers.dev`
   - routes: `/`, `/ink`, `/payward`, `/alpha-briefs`, `/about`
3. CI comments one deterministic preview URL on the PR.

Notes:

- No separate preview build/worker codepath exists.
- Production deploy remains `main` -> `Deploy to Cloudflare Workers`.

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

Refresh data snapshot locally:

```bash
npm run refresh:data
```

## Daily data refresh automation

The project includes a scheduled GitHub Actions workflow:

- `.github/workflows/daily-data-refresh.yml`
- Workflow name: `Daily Data Refresh`
- Schedule: daily at `14:15 UTC`

It refreshes `public/site-data.json` from:

- DeFiLlama (Ink TVL + protocol count)
- Polymarket (`kraken-ipo-in-2025`)
- Kalshi (`KXIPO-26-KRAKEN`)
- Hiive, Forge, Nasdaq Private Market, Notice (best-effort secondary price sources)

The workflow commits updated `public/site-data.json` back to `main` when values change.

## Daily Ink 24h X snapshot

The project can also generate a daily internal snapshot report from a monitored
X List (with optional account fallback).

- Workflow: `.github/workflows/daily-x-monitor.yml`
- Name: `Daily X Monitor Report`
- Schedule: daily at `14:45 UTC`
- Output:
  - report: `reports/x-daily/YYYY-MM-DD.md`
  - internal raw data: `reports/x-daily/raw/YYYY-MM-DD.json`

### Where to enter your inputs

1. Edit account list + objective in:
   - `config/x-monitor.config.json`
   - Primary mode: set `list_id` (example: `2046327906943500367`)
   - Optional fallback: `accounts_fallback` usernames
2. Add required GitHub repository secrets:
   - `X_BEARER_TOKEN`
   - `OPENAI_API_KEY`
   - optional: `X_MONITOR_LLM_MODEL`
   - Note: your X API project must have active API credits/plan access for list
     and timeline endpoints. Without credits, runs fail with `CreditsDepleted`.
3. (Optional) run locally:
   - `npm run report:x-daily`

### Runtime model

This runs in GitHub Actions on a daily schedule (not inside the Cloudflare
Worker runtime). The Worker and app serve the site; the snapshot job is a
separate automation pipeline that writes reports to the repo.
