# Wiki.js Internal Docs Rollout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch a minimal Wiki.js deployment blueprint, map the first internal documentation sections, and make `vps-links` point to the new wiki pages instead of fragile mixed doc links.

**Architecture:** Keep `vps-links` as the public static catalog and add a separate `Wiki.js` deployment blueprint under `ops/wiki-js/`. The portal links to stable wiki paths per service and per operational topic, while the wiki itself is deployed behind a reverse proxy on its own subdomain and stores the detailed internal runbooks.

**Tech Stack:** Astro, TypeScript, Markdown, Docker Compose, Wiki.js, PostgreSQL, nginx

---

## Chunk 1: Wiki.js Deployment Blueprint

### Task 1: Add the minimal Wiki.js runtime files

**Files:**
- Create: `ops/wiki-js/docker-compose.yml`
- Create: `ops/wiki-js/.env.example`
- Create: `ops/wiki-js/README.md`
- Create: `ops/wiki-js/nginx/wiki.acom-offer-desk.ru.conf`

- [ ] **Step 1: Create the Docker Compose file**

```yaml
services:
  wikijs-db:
    image: postgres:16
    container_name: wikijs-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - wikijs-db-data:/var/lib/postgresql/data
    networks:
      - wikijs

  wikijs:
    image: ghcr.io/requarks/wiki:2
    container_name: wikijs
    restart: unless-stopped
    depends_on:
      - wikijs-db
    environment:
      DB_TYPE: postgres
      DB_HOST: wikijs-db
      DB_PORT: 5432
      DB_NAME: ${POSTGRES_DB}
      DB_USER: ${POSTGRES_USER}
      DB_PASS: ${POSTGRES_PASSWORD}
      PORT: 3000
    ports:
      - "127.0.0.1:${WIKIJS_HOST_PORT}:3000"
    networks:
      - wikijs

volumes:
  wikijs-db-data:

networks:
  wikijs:
    driver: bridge
```

- [ ] **Step 2: Create the environment example**

```env
POSTGRES_DB=wikijs
POSTGRES_USER=wikijs
POSTGRES_PASSWORD=change-me
WIKIJS_HOST_PORT=3010
WIKIJS_DOMAIN=wiki.acom-offer-desk.ru
```

- [ ] **Step 3: Create the nginx vhost blueprint**

```nginx
server {
    server_name wiki.acom-offer-desk.ru;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

- [ ] **Step 4: Create the rollout README**

```md
# Wiki.js rollout

## Purpose

This directory contains the minimum deployment blueprint for the internal Wiki.js instance that will host operational documentation for VPS services.

## First pages to create

- `/services/acom-offer-desk`
- `/services/converter`
- `/services/camunda`
- `/services/llm-webui`
- `/ops/access`
- `/ops/deploy`
- `/ops/troubleshooting`
- `/ops/monitoring`

## Deploy outline

1. Copy `.env.example` to `.env` and replace secrets.
2. Run `docker compose up -d`.
3. Attach nginx to `wiki.acom-offer-desk.ru`.
4. Log in to Wiki.js and create the first page tree.
```

- [ ] **Step 5: Validate the compose file**

Run: `docker compose -f ops/wiki-js/docker-compose.yml --env-file ops/wiki-js/.env.example config`
Expected: exit code `0` and rendered Compose config with `wikijs` and `wikijs-db`

## Chunk 2: Portal Integration

### Task 2: Point project cards to the new wiki

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/pages/knowledge/access.md`
- Modify: `src/pages/knowledge/deploy.md`
- Modify: `src/pages/knowledge/troubleshooting.md`
- Modify: `src/pages/knowledge/monitoring.md`

- [ ] **Step 1: Replace per-service primary doc links**

```ts
primaryDocLink: {
  label: 'Внутренняя wiki',
  href: 'https://wiki.acom-offer-desk.ru/services/acom-offer-desk'
}
```

Apply the same pattern for:

```ts
https://wiki.acom-offer-desk.ru/services/converter
https://wiki.acom-offer-desk.ru/services/camunda
https://wiki.acom-offer-desk.ru/services/llm-webui
```

- [ ] **Step 2: Make `docsLinks` wiki-first**

```ts
docsLinks: [
  {
    label: 'Внутренняя wiki',
    href: 'https://wiki.acom-offer-desk.ru/services/converter'
  },
  {
    label: 'Публичный репозиторий',
    href: 'https://github.com/vvv-web/converter'
  }
]
```

- [ ] **Step 3: Update knowledge pages to the new `/ops/*` wiki paths**

```md
- [Полная внутренняя документация по доступу](https://wiki.acom-offer-desk.ru/ops/access)
- [Полная внутренняя документация по деплою](https://wiki.acom-offer-desk.ru/ops/deploy)
- [Полная внутренняя документация по troubleshooting](https://wiki.acom-offer-desk.ru/ops/troubleshooting)
- [Полная внутренняя документация по мониторингу](https://wiki.acom-offer-desk.ru/ops/monitoring)
```

- [ ] **Step 4: Run the portal test suite**

Run: `npm test`
Expected: Vitest exits `0`

- [ ] **Step 5: Run Astro checks**

Run: `npm run check`
Expected: Astro exits `0`

- [ ] **Step 6: Build the static site**

Run: `npm run build`
Expected: Astro writes `dist/` without errors

## Chunk 3: Verification

### Task 3: Verify rollout readiness

**Files:**
- Verify: `ops/wiki-js/docker-compose.yml`
- Verify: `ops/wiki-js/.env.example`
- Verify: `ops/wiki-js/nginx/wiki.acom-offer-desk.ru.conf`
- Verify: `src/data/projects.ts`
- Verify: `src/pages/knowledge/*.md`

- [ ] **Step 1: Confirm the wiki blueprint is self-consistent**

Run: `docker compose -f ops/wiki-js/docker-compose.yml --env-file ops/wiki-js/.env.example config`
Expected: exit code `0`

- [ ] **Step 2: Confirm the portal compiles with the new links**

Run: `npm run build`
Expected: exit code `0`

- [ ] **Step 3: Confirm the main requirements checklist**

Checklist:
- `Wiki.js` blueprint exists in `ops/wiki-js/`
- every service has a stable wiki URL
- every operational knowledge page points to a stable `/ops/*` wiki page
- public portal still builds successfully
- no secrets are committed

