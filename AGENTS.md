# Agent notes

Public resume site template: static Vue + Web Awesome, JSON-driven content, optional Vercel Blob for private deploys. Treat this document as repo conventions for anyone (or any agent) changing the code.

## Architecture

- The browser loads `**content/${lang}.json**` and resolves photos as `**content/${filename}**`. There is no live/demo switch in JavaScript.
- `**content/**` holds the **demo** resume (fictional data). It is committed and is what GitHub Pages serves out of the box.
- `**live/**` mirrors `content/` for a **private** resume copy. It is **gitignored**; forks or maintainers use it locally and for upload, but it must never be committed.
- **Vercel deploys** (optional): `vercel.json` redirects `/content/:path*` to a configured blob base URL. `**.vercelignore`** excludes `content/` so static demo files do not override that redirect.

Do not point the app at blob URLs directly unless the project explicitly changes that design—GitHub Pages and Vercel are meant to share the same `content/` paths with different backends.

## Secrets and environment

- Do **not** read, grep, edit, or commit `.env`, `.env.local`, or other pulled secret files.
- `**pnpm upload**` needs only `BLOB_READ_WRITE_TOKEN` in a gitignored `.env` at the repo root. `scripts/upload.mjs` loads that file with `dotenv` and passes the token to `@vercel/blob`. Do not paste the token into issues, PRs, or the repo.
- Rotating upload credentials does **not** change public blob object URLs or the redirect pattern in `vercel.json`; it only affects who can write to the store.

## Scripts


| Command       | Purpose                                                                             |
| ------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`    | Static file server (`scripts/dev.mjs`, default port 4173)                           |
| `pnpm upload` | Upload `live/*` to the linked blob store; sync redirect target in `vercel.json`     |
| `pnpm pdf`    | Playwright PDF to `output/`; `--live` serves `/content/*` from `live/` for that run |


After changing dependencies, run `pnpm install` and commit `pnpm-lock.yaml` when making a dependency-related change.

## Content and i18n

- Locales: `**en**` (default), `**pt-br**` via `?lang=pt-br`.
- `**hideScores=true**` (or `pnpm pdf -- --hide-scores`) hides skill and language level bars.
- JSON `photo` is usually a filename (e.g. `photo.jpg`) under `content/`, unless it is already an absolute URL.

Keep `content/*.json` aligned with the shape consumed in `resume.js` and validated in `scripts/print-pdf.mjs`.

## Deployment (in repo)

- **GitHub Pages:** `.github/workflows/deploy-pages.yml` publishes the tree on push to `main`; demo content comes from committed `content/`.
- **Vercel:** static hosting plus redirects in `vercel.json`. After `pnpm upload`, commit `vercel.json` if the blob base URL in the redirect changed.

Only change redirect vs rewrite behavior when there is a clear requirement (e.g. keeping the browser URL on the site origin instead of following the blob host).

## Scope and docs

- `**writing-your-resume.md**` is a general writing guide (includes an AI/research disclaimer). Keep `**content/**` fictional or clearly demo; do not add real people's private resume data to the public tree.
- Prefer **small, focused diffs**. The site has **no build step** for HTML/JS/CSS unless one is added deliberately.
- `**README.md**` is the human-facing overview.

## Common changes

1. **Demo UI or copy** — `index.html`, `resume.js`, `resume.css`, `content/*.json`.
2. **New field or section** — template + `resume.js` + demo JSON + optional schema in `print-pdf.mjs`.
3. **PDF behavior** — `scripts/print-pdf.mjs`.
4. **Blob upload or redirect** — `scripts/upload.mjs`, `vercel.json`, `.vercelignore`.

## Do not commit

- `node_modules/`, `.pnpm-store/`, `output/`, `.vercel/`, `.env*`, `**live/**`, or secrets of any kind.

