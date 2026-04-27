# Deployment Runbook (Workers Canonical)

This project now uses a **single production deployment path**:

- Cloudflare Workers service: `wispy-sun-811e`
- Custom domain: `krakenwatch.com`

## Pushing changes from Replit to GitHub

The Replit workspace is a **pnpm monorepo** (`artifacts/krakenwatch/` is one
package inside it). The GitHub repo `salwilliam/krakenwatch` expects only the
krakenwatch site files — pushing the whole monorepo there is wrong and will
break CI.

Use the deploy script at the workspace root instead of raw `git push`:

```bash
bash scripts/deploy-krakenwatch.sh
```

What the script does, step by step:

1. **Regenerates `package-lock.json`** inside `artifacts/krakenwatch/` using
   `npm install --package-lock-only`. This keeps the npm lockfile in sync with
   `package.json` so GitHub Actions' `npm ci` step never fails due to a stale
   lockfile. If the lockfile changed it is committed automatically.
2. **Adds the `krakenwatch-origin` remote** pointing to
   `git@github.com:salwilliam/krakenwatch.git` (idempotent — skipped if it
   already exists with the correct URL).
3. **Runs `git subtree split`** on the `artifacts/krakenwatch/` prefix to
   produce a temporary local branch containing only the krakenwatch files and
   their history. No other monorepo content is included.
4. **Pushes** that temporary branch to `salwilliam/krakenwatch` `main`.
5. **Deletes** the temporary branch to keep the local repo clean.

### Flags

| Flag | Effect |
|------|--------|
| `--skip-lockfile` | Skip regenerating `package-lock.json`. Use when you know it is already correct. |
| `--yes` | Non-interactive mode — auto-confirms all prompts. Safe for scripted use once SSH access is confirmed. |

### Prerequisites

- An **SSH key** authorised for `salwilliam/krakenwatch` must be available in
  the shell (e.g. `~/.ssh/id_ed25519` or an SSH agent via `SSH_AUTH_SOCK`).
  The script uses the SSH remote endpoint; `GITHUB_TOKEN`/HTTPS is not
  supported. See follow-up task #10 for automating SSH key setup in Replit.
- `npm` must be available in the shell (needed unless `--skip-lockfile` is
  passed).
- Run the script from the workspace root (the directory that contains
  `artifacts/`).

### Typical workflow

```bash
# 1. Make your changes inside artifacts/krakenwatch/
# 2. Commit them to the Replit workspace as normal
# 3. When ready to publish:
bash scripts/deploy-krakenwatch.sh
# 4. Watch the GitHub Actions run at:
#    https://github.com/salwilliam/krakenwatch/actions
```

## Source of truth

- Production traffic is served through the Worker proxy in `src/worker.js`.
- Canonical baseline target is `https://1d2a3088.krakenwatch.pages.dev`.
- Deploy workflow: `.github/workflows/deploy.yml`.

## Critical rules

1. Do not route `krakenwatch.com` to a second production project.
2. Do not upload Pages `_redirects` into Workers assets.
3. Keep only one production-capable domain binding active.
4. While emergency proxy mode is active, both must stay true:
   - `src/worker.js` proxies to `1d2a3088.krakenwatch.pages.dev`
   - `wrangler.workers.toml` contains `run_worker_first = true`

## Deploy checks

After each merge (automated in CI and also safe to run manually):

1. Verify workflow success (`Deploy to Cloudflare Workers`).
2. Verify hashes/signatures on:
   - `https://krakenwatch.com/`
   - `https://wispy-sun-811e.krakenwatch.workers.dev/`
   - Baseline comparison target: `https://1d2a3088.krakenwatch.pages.dev/`
3. Verify routes return `200` and signatures match baseline:
   - `/`
   - `/ink`
   - `/payward`
   - `/alpha-briefs`
   - `/about`

## Incident-prevention guardrails in CI

The deploy workflow now hard-fails if either condition regresses:

- Proxy host pin removed from `src/worker.js`
- `run_worker_first = true` missing in `wrangler.workers.toml`

After deployment, CI also compares production + worker route signatures to the
known-good baseline route-by-route (`/`, `/ink`, `/payward`, `/alpha-briefs`, `/about`).

## Preview policy: single canonical codepath only

- PR preview URLs must use the same canonical proxy codepath as production.
- No preview workflow may deploy alternate built bundles as standalone app previews.
- `.github/workflows/pr-preview.yml` must:
  - validate canonical proxy invariants (`run_worker_first = true` and pinned proxy hostname)
  - publish the deterministic canonical preview URL: `https://wispy-sun-811e.krakenwatch.workers.dev`
- Any preview implementation that serves source-built assets directly is disallowed.

## Cloudflare cleanup target

Once stable:

- Keep `wispy-sun-811e` as canonical production target.
- Remove or disable production domain routing on the Pages project to prevent split deployments.
