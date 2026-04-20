# VPS Links

Public GitHub Pages showcase for VPS projects: главная с карточками проектов и страницы `/projects/[slug]` (стенд, URL, ссылки на документацию). Отдельной «базы знаний» на сайте нет — операционка во внутренней wiki.

## URL shape

This repo is configured for the GitHub Pages project URL:

`https://vvv-web.github.io/vps-links/`

That means:

- `site` should stay at the account host: `https://vvv-web.github.io`
- `base` should stay at the repository path: `/vps-links`

Both values are set in `astro.config.mjs`.

## What is included

- Главная с карточками проектов
- Страницы проектов из `src/data/projects.ts`
- Статическая сборка и GitHub Pages (GitHub Actions)

## Wiki.js rollout status

As of `2026-04-07`, this portal is wired to the first live `Wiki.js` instance for VPS service documentation.

- Live wiki base URL: `https://wiki.acom-offer-desk.ru/`
- Access model: public read for service and ops pages, authenticated edit/admin only
- Карточки проектов ведут на стабильные wiki-страницы сервисов, где это уместно
- Deployment blueprints live in `ops/wiki-js/`, while implementation notes live in `docs/superpowers/plans/`

## Where content lives

| Path | Purpose |
| :--- | :------ |
| `src/data/projects.ts` | Источник данных для карточек и `/projects/[slug]` |
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
