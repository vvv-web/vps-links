---
layout: ../../layouts/BaseLayout.astro
title: "Мониторинг"
description: "Где искать сигналы о работоспособности сервисов, не превращая витрину в live-dashboard."
eyebrow: "База знаний"
pageTitle: "Мониторинг"
pageLead: "Витрина не показывает живые статусы. Эта страница помогает быстро понять, где уже есть monitoring-слой и какие документы использовать для проверки."
currentPath: "/knowledge/monitoring/"
breadcrumbs:
  - label: "Главная"
    href: "/"
  - label: "База знаний"
    href: "/#knowledge"
  - label: "Мониторинг"
---

## Что мониторить в v1

- Доступность публичного URL.
- Наличие service page в Wiki.js с описанием health-check и smoke-check шагов.
- Понимание, есть ли у сервиса отдельный operational слой вне самой витрины.

## Карта по текущим сервисам

- `AcomOfferDesk` уже имеет отдельный monitoring-view, но он остаётся вторичным слоем.
- `Converter` документирует health-check endpoints внутри VPS runbook.
- `Camunda` живёт как проксируемый orchestration-контур и опирается на project info + access docs.
- `LLM / Open WebUI` разделяет API-домен и GUI, поэтому важно проверять обе публичные точки входа по отдельности.

## Что читать первым

1. Project page нужного сервиса.
2. Service page в Wiki.js.
3. Deploy / troubleshooting knowledge page внутри портала.
4. Внешний runbook или project info, если нужна детальная operational проверка.

## Рабочие документы

- [Wiki.js: monitoring](https://wiki.acom-offer-desk.ru/ops/monitoring)
- [Wiki.js: Converter](https://wiki.acom-offer-desk.ru/services/converter)
- [Wiki.js: Camunda](https://wiki.acom-offer-desk.ru/services/camunda)
- [AcomOfferDesk repository](https://github.com/vvv-web/AcomOfferDesk)
