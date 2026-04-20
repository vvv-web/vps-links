# Wiki.js rollout

This directory contains the deployment blueprint and live rollout notes for the `Wiki.js` instance that hosts VPS service documentation.

## Current live state

- Base URL: `https://wiki.acom-offer-desk.ru/`
- Runtime location on VPS: `/opt/wikijs`
- Reverse proxy entrypoint: nginx vhost for `wiki.acom-offer-desk.ru`
- Access model: public read for `/services/*` and `/ops/*`, authenticated edit/admin only
- Portal integration: `vps-links` project cards and knowledge pages point to stable wiki paths

## First pages to create

- `/services/acom-offer-desk`
- `/services/converter`
- `/services/camunda`
- `/services/llm-webui`
- `/ops/access`
- `/ops/deploy`
- `/ops/troubleshooting`
- `/ops/monitoring`

## Recommended content flow

1. Copy `.env.example` to `.env` and replace secrets.
2. Run `docker compose up -d`.
3. Attach nginx to `wiki.acom-offer-desk.ru`.
4. Create or update the page tree from `content-map.md`.
5. Use the templates in `templates/` for the first service pages and runbooks.
6. Keep `vps-links` in sync when a new service page is added to the wiki.

## Versioned page sources (`pages/`)

Markdown-исходники для отдельных сервисных страниц хранятся в репозитории под `ops/wiki-js/pages/` (например `pages/services-converter.md` для `/services/converter`). Это канон для правок в Git; публикация в живую Wiki.js — вручную через UI или скриптом:

```bash
export WIKIJS_API_TOKEN='…'   # Administration → API Access
./ops/wiki-js/scripts/publish-page.sh ops/wiki-js/pages/services-converter.md
```

Переменные `WIKIJS_PAGE_ID`, `WIKIJS_PAGE_PATH`, `WIKIJS_LOCALE` задавайте при публикации другой страницы.

## Why this sits next to vps-links

The portal remains a public-safe service catalog. Wiki.js stores the deeper operational layer, while `vps-links` exposes stable wiki links and a short runbook from one shared entrypoint.
