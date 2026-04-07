# Wiki.js Live Rollout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

## Execution status update

**Executed on:** `2026-04-07`

- The live `Wiki.js` stack was deployed on the VPS behind nginx and TLS on `https://wiki.acom-offer-desk.ru/`.
- The initial `/services/*` and `/ops/*` page tree was created and linked from `vps-links`.
- Final access model differs from the original draft of this plan: the wiki now uses **public read** for guests and keeps edit/admin actions behind authentication.
- The `vps-links` homepage hero and knowledge pages were updated to point users to the stable wiki paths.

**Goal:** Deploy a first live Wiki.js instance on the existing VPS, route it through nginx on `wiki.acom-offer-desk.ru`, and create the first documentation tree for the service catalog.

**Architecture:** Keep public traffic on the existing host nginx, terminate TLS there, and proxy the new wiki subdomain to a dedicated Docker Compose stack listening only on `127.0.0.1:3010`. Use a dedicated PostgreSQL container for Wiki.js, store the stack under `/opt/wikijs`, and create the first `/services/*` and `/ops/*` pages directly in the wiki UI.

**Tech Stack:** Docker Compose, Wiki.js 2.x, PostgreSQL 16, nginx, certbot

---

## Chunk 1: VPS rollout

### Task 1: Deploy the Wiki.js stack on the VPS

**Files:**
- Local source: `ops/wiki-js/docker-compose.yml`
- Local source: `ops/wiki-js/nginx/wiki.acom-offer-desk.ru.conf`
- Local source: `ops/wiki-js/.env.example`
- Remote target: `/opt/wikijs/docker-compose.yml`
- Remote target: `/opt/wikijs/.env`
- Remote target: `/etc/nginx/sites-available/wiki.acom-offer-desk.ru`

- [ ] **Step 1: Create the target directory on the VPS**

Run: `ssh root@155.212.160.162 "mkdir -p /opt/wikijs/nginx"`
Expected: directory exists under `/opt/wikijs`

- [ ] **Step 2: Generate a real `.env` on the VPS**

Run: `ssh root@155.212.160.162 "python3 - <<'PY'\nimport secrets\nprint('POSTGRES_DB=wikijs')\nprint('POSTGRES_USER=wikijs')\nprint('POSTGRES_PASSWORD=' + secrets.token_urlsafe(24))\nprint('WIKIJS_HOST_PORT=3010')\nprint('WIKIJS_DOMAIN=wiki.acom-offer-desk.ru')\nPY"`
Expected: five environment lines, with a random password

- [ ] **Step 3: Copy the compose and nginx files to the VPS**

Run: `scp ops/wiki-js/docker-compose.yml root@155.212.160.162:/opt/wikijs/docker-compose.yml`
Expected: file is copied without error

- [ ] **Step 4: Validate the stack remotely**

Run: `ssh root@155.212.160.162 "cd /opt/wikijs && docker compose --env-file .env config"`
Expected: exit code `0`

- [ ] **Step 5: Start the containers**

Run: `ssh root@155.212.160.162 "cd /opt/wikijs && docker compose --env-file .env up -d"`
Expected: `wikijs` and `wikijs-db` are created and running

## Chunk 2: nginx and TLS

### Task 2: Expose the wiki through the existing reverse proxy

**Files:**
- Remote target: `/etc/nginx/sites-available/wiki.acom-offer-desk.ru`
- Remote target: `/etc/nginx/sites-enabled/wiki.acom-offer-desk.ru`

- [ ] **Step 1: Install the vhost**

Run: `ssh root@155.212.160.162 "cp /opt/wikijs/nginx/wiki.acom-offer-desk.ru.conf /etc/nginx/sites-available/wiki.acom-offer-desk.ru && ln -sf /etc/nginx/sites-available/wiki.acom-offer-desk.ru /etc/nginx/sites-enabled/wiki.acom-offer-desk.ru"`
Expected: new wiki vhost appears in `sites-enabled`

- [ ] **Step 2: Validate and reload nginx**

Run: `ssh root@155.212.160.162 "nginx -t && systemctl reload nginx"`
Expected: syntax OK and nginx reload succeeds

- [ ] **Step 3: Issue the certificate**

Run: `ssh root@155.212.160.162 "certbot --nginx -d wiki.acom-offer-desk.ru --non-interactive --agree-tos -m admin@acom-offer-desk.ru --redirect"`
Expected: certificate issued and HTTPS redirect enabled

## Chunk 3: Seed content and privacy

### Task 3: Create the first page tree and lock the wiki down

**Files:**
- Source reference: `ops/wiki-js/content-map.md`
- Source reference: `ops/wiki-js/templates/service-template.md`
- Source reference: `ops/wiki-js/templates/ops-template.md`

- [ ] **Step 1: Log into the fresh Wiki.js instance**

Action: open `https://wiki.acom-offer-desk.ru`
Expected: Wiki.js setup/login screen is available

- [ ] **Step 2: Create the first eight pages**

Create:
- `/services/acom-offer-desk`
- `/services/converter`
- `/services/camunda`
- `/services/llm-webui`
- `/ops/access`
- `/ops/deploy`
- `/ops/troubleshooting`
- `/ops/monitoring`

- [ ] **Step 3: Make the wiki private**

Action: in `Administration -> Groups -> Guest`, remove global read permissions or change the default page rule to deny
Expected: anonymous users cannot read pages

## Chunk 4: Final verification

### Task 4: Verify the live instance and portal integration

**Files:**
- Verify: `/opt/wikijs/docker-compose.yml`
- Verify: `src/data/projects.ts`
- Verify: `src/pages/knowledge/*.md`

- [ ] **Step 1: Verify containers**

Run: `ssh root@155.212.160.162 "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | awk 'NR==1 || /wikijs/'"`
Expected: `wikijs` and `wikijs-db` are running

- [ ] **Step 2: Verify HTTPS response**

Run: `curl -I https://wiki.acom-offer-desk.ru`
Expected: `200`, `301`, or `302` over HTTPS, not `404` / `502`

- [ ] **Step 3: Verify the portal still builds locally**

Run: `npm test && npm run check && npm run build`
Expected: all commands exit `0`
