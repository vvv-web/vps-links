---
layout: ../../layouts/BaseLayout.astro
title: "Развертывание"
description: "Короткая карта деплоя для сервисов из витрины: GitHub, ветка, pull и build на целевом контуре."
eyebrow: "База знаний"
pageTitle: "Развертывание"
pageLead: "Как мыслить путь релиза в этой витрине: сначала ветка и source of truth, потом инфраструктурный контур, затем проверка результата."
currentPath: "/knowledge/deploy/"
breadcrumbs:
  - label: "Главная"
    href: "/"
  - label: "База знаний"
    href: "/#knowledge"
  - label: "Развертывание"
---

## Общий маршрут

1. Уточнить, какой репозиторий и какая ветка являются источником правды для конкретного сервиса.
2. Проверить связанный runbook или deploy-документ.
3. Выполнить pull/build только в том контуре, который описан в документации проекта.
4. После релиза пройти проверку доступности публичного URL.

> Базовая operational-карта деплоя теперь должна жить в `Wiki.js`, а публичная витрина остаётся только безопасной точкой входа.

## Где особенно важно не перепутать ветку

- Для `Converter` в runbook явно указан production-ориентир: ветка `prototype`.
- Для `AcomOfferDesk` deploy-логика описана через GitHub Actions и VPS-compose контур.
- Для `Camunda` важно помнить, что VPS — это публичный вход и прокси-слой, а не весь compute-контур.

## Что читать первым

- Сначала service page в Wiki.js.
- Затем deploy / rollback блок на этой странице.
- И только потом README или публичный workflow, если нужен внешний контекст.

## Рабочие документы

- [Wiki.js: deploy](https://wiki.acom-offer-desk.ru/ops/deploy)
- [Wiki.js: Converter](https://wiki.acom-offer-desk.ru/services/converter)
- [Wiki.js: Camunda](https://wiki.acom-offer-desk.ru/services/camunda)
- [AcomOfferDesk repository](https://github.com/vvv-web/AcomOfferDesk)
