# VPS Links

Bootstrap repository for the VPS showcase portal published as a GitHub Pages project site.

## URL shape

This repo is configured for the GitHub Pages project URL:

`https://vvv-web.github.io/vps-links/`

That means:

- `site` should stay at the account host: `https://vvv-web.github.io`
- `base` should stay at the repository path: `/vps-links`

Both values are set in `astro.config.mjs`.

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
| `npm run dev` | Start local Astro dev server |
| `npm run check` | Run Astro type/content checks |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the production build locally |

## Current scope

Task 1 only establishes the baseline:

- Astro project scaffold with TypeScript config
- GitHub Pages project-site configuration
- GitHub Actions deployment workflow
- Minimal placeholder homepage for the portal bootstrap
