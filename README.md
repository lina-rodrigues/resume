# Resume site

A static resume you open in the browser or export to PDF. The page is Vue 3 and [Web Awesome](https://webawesome.com/) on plain HTML/CSS/JS—no build step for the site itself.

**Live:** my own resume is available at [linarodrigues.dev](https://linarodrigues.dev)

**Demo (public):** fictional resume under `content/`, hosted on GitHub Pages at [lina-rodrigues.github.io/resume](https://lina-rodrigues.github.io/resume/).

The app always requests `content/…` paths. When deploying to Vercel, `vercel.json` redirects those URLs to the blob store; on GitHub Pages, the repo’s `content/` files answer instead.

## Stack

- Vue 3 (CDN), Web Awesome (Tailspin / Vogue / Indigo)
- Resume data: `content/en.json`, `content/pt-br.json`, `content/photo.jpg` (demo)
- i18n: `?lang=pt-br` (default English)
- Print/PDF: Playwright (`pnpm pdf`)
- Live files: Vercel Blob store **resume-blob**, synced with `pnpm upload`



## Repository layout


| Path                                    | Role                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `index.html`, `resume.js`, `resume.css` | App shell and layout                                                      |
| `content/`                              | Demo resume (safe to commit)                                              |
| `live/`                                 | Real resume mirror ( **not** in git—copy structure from `content/`)       |
| `scripts/dev.mjs`                       | Local static server (port 4173)                                           |
| `scripts/upload.mjs`                    | Upload `live/*` to blob; updates blob redirect in `vercel.json`           |
| `scripts/print-pdf.mjs`                 | PDF export to `output/`                                                   |
| `vercel.json`                           | Static deploy + `/content/*` → blob redirect                              |
| `.vercelignore`                         | Omits `content/` from Vercel deploy so redirects hit blob, not demo files |
| `writing-your-resume.md`                | How to write resume copy (separate from the app)                          |




## Local development

```bash
pnpm install
pnpm dev
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Add `?lang=pt-br` for Brazilian Portuguese.

Theme follows system light/dark unless you toggle the switch on the page.

## PDF export

Demo (reads `content/`):

```bash
pnpm pdf
pnpm pdf -- --lang=pt-br
pnpm pdf -- --hide-scores
```

Live copy (serves `/content/*` from `live/` for the print run):

```bash
pnpm pdf -- --live --lang=en
```

Output: `output/resume-en.pdf` or `output/resume-live-en.pdf` (and `pt-br` variants).

Install browser binaries once if Playwright asks: `pnpm exec playwright install chromium`.

## Publishing live content

1. Maintain `live/en.json`, `live/pt-br.json`, and `live/photo.jpg` (same shape as `content/`).
2. Put `BLOB_READ_WRITE_TOKEN` in a gitignored `.env` at the repo root. That read-write token is the only credential `pnpm upload` uses. Do not commit it, and do not run the upload through `vercel env run` or OIDC.
3. Run:

```bash
pnpm upload
```

That uploads to the **resume-blob** store root (`en.json`, `pt-br.json`, `photo.jpg`) and rewrites the `/content/:path`* redirect destination in `vercel.json` if the public blob base URL changed. Commit and deploy `vercel.json` when that file changes.

Public blob URLs and existing objects stay the same across token rotation; only upload credentials change.

## Deployment


| Target           | What gets deployed                                                      | Content source    |
| ---------------- | ----------------------------------------------------------------------- | ----------------- |
| **GitHub Pages** | Whole repo on push to `main` (see `.github/workflows/deploy-pages.yml`) | Repo `content/`   |
| **Vercel**       | Static site; `content/` excluded via `.vercelignore`                    | Blob via redirect |


GitHub repo: [github.com/lina-rodrigues/resume](https://github.com/lina-rodrigues/resume). Pages needs **Settings → Pages → Source: GitHub Actions** once.

## JSON shape

Each locale file is one JSON object: `name`, `title`, `photo` (filename relative to `content/`), `summary`, `contact`, `experience[]`, `projects[]`, `skills[]` (optional `level` 1–10), `languages[]` (optional `level` 1–5), `education[]`, and `labels` for section headings. Missing fields are omitted in the UI.

For print without skill/language bars: `?hideScores=true` or `pnpm pdf -- --hide-scores`.

## Writing copy

See [writing-your-resume.md](./writing-your-resume.md) for a guideline of how the content for the resume should be written.