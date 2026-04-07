# VPS Links

Public GitHub Pages showcase for VPS projects: brand-first landing page, internal project pages, and internal knowledge pages backed by structured data plus Markdown.

## URL shape

This repo is configured for the GitHub Pages project URL:

`https://vvv-web.github.io/vps-links/`

That means:

- `site` should stay at the account host: `https://vvv-web.github.io`
- `base` should stay at the repository path: `/vps-links`

Both values are set in `astro.config.mjs`.

## What is included in v1

- Branded homepage with project cards and knowledge cards
- Dynamic project pages from `src/data/projects.ts`
- Internal knowledge pages in `src/pages/knowledge/*.md`
- Static deployment to GitHub Pages through GitHub Actions

## Wiki.js rollout status

As of `2026-04-07`, this portal is wired to the first live `Wiki.js` instance for VPS service documentation.

- Live wiki base URL: `https://wiki.acom-offer-desk.ru/`
- Access model: public read for service and ops pages, authenticated edit/admin only
- Project cards and knowledge pages prefer stable wiki links over mixed external doc targets
- The homepage hero includes a short runbook for opening the wiki, finding `/services/*` and `/ops/*`, and extending the catalog
- Deployment blueprints live in `ops/wiki-js/`, while implementation notes live in `docs/superpowers/plans/`

## Where content lives

| Path | Purpose |
| :--- | :------ |
| `src/data/projects.ts` | Canonical source of truth for project cards and `/projects/[slug]` pages |
| `src/pages/knowledge/*.md` | Internal knowledge base pages |
| `src/components/` | Reusable portal UI blocks |
| `src/layouts/BaseLayout.astro` | Shared layout, nav, breadcrumbs, footer |
| `src/styles/global.css` | Global visual system |
| `ops/wiki-js/` | Wiki.js compose, nginx, page map, and content templates for the VPS doc layer |
| `docs/superpowers/plans/` | Rollout plans and execution notes for the Wiki.js integration |

## How to update the portal

### Add or update a project

1. Edit `src/data/projects.ts`.
2. Keep the `slug` unique.
3. Prefer the stable `Wiki.js` service page as the primary doc target when it exists.
4. Add only publicly safe URLs in `publicUrl`, `repoUrl`, and `docsLinks`.
5. Run `npm test`, `npm run check`, and `npm run build`.

### Add or update a knowledge page

1. Create or edit a Markdown file in `src/pages/knowledge/`.
2. Keep the page in plain Markdown with frontmatter that points to `BaseLayout.astro`.
3. If a full operational version exists in `Wiki.js`, link to that page from the Markdown summary.
4. If the page should appear on the homepage, update `vpsKnowledgePages` in `src/data/projects.ts`.
5. Run `npm run check` and `npm run build`.

## Content safety checklist

- Do not publish secrets, tokens, internal IPs, private dashboards, or credentialed URLs.
- Prefer public GitHub docs and public service entrypoints.
- If a project has no safe public repository link, leave it out instead of guessing.

## Where to change Pages settings later

If this project moves to a different GitHub account, repository name, or custom domain, update:

1. `astro.config.mjs`
2. GitHub repository Pages settings
3. Any hard-coded project links in page content

For a custom domain later:

- change `site` to the final domain
- remove `base`
- add `public/CNAME` when the custom-domain task is approved

## Commands

Run from the repository root:

| Command | Purpose |
| :------ | :------ |
| `npm install` | Install dependencies |
| `npm test` | Run Vitest checks for catalog and route data |
| `npm run dev` | Start local Astro dev server |
| `npm run check` | Run Astro type/content checks |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the production build locally |
