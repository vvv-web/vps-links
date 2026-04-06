---
layout: ../../layouts/BaseLayout.astro
title: "Доступ"
description: "Краткая карта публичных входов в сервисы VPS и безопасных GitHub-источников."
eyebrow: "База знаний"
pageTitle: "Доступ к сервисам"
pageLead: "Куда кликать в первую очередь, если нужен рабочий URL, GitHub-репозиторий или краткая проектная сводка внутри портала."
currentPath: "/knowledge/access/"
breadcrumbs:
  - label: "Главная"
    href: "/"
  - label: "База знаний"
    href: "/#knowledge"
  - label: "Доступ"
---

## Что открывать первым

- Если нужен сам сервис, начинайте с карточек на главной.
- Если нужен контекст по сервису, переходите на внутреннюю project page через кнопку `О проекте`.
- Если нужна исходная документация, используйте внешние ссылки на GitHub из project page.

## Публичные точки входа

- `AcomOfferDesk` — основной веб-контур на `https://app.acom-offer-desk.ru/`.
- `Converter` — домен конвертера на `https://converter.acom-offer-desk.ru/`.
- `Camunda` — публичная точка входа в orchestration-контур через `https://camunda.acom-offer-desk.ru/operate`.
- `LLM / Open WebUI` — API и GUI на `https://llm.acom-offer-desk.ru/` и `https://webui.acom-offer-desk.ru/`.

## Что читать первым

1. Сначала внутреннюю страницу проекта.
2. Затем README или runbook из карточки `Документация`.
3. Только после этого переходить к более глубоким operational-артефактам.

## Внешние первоисточники

- [AcomOfferDesk](https://github.com/vvv-web/AcomOfferDesk#readme)
- [Converter project docs](/projects/converter/#docs)
- [Camunda project docs](/projects/camunda/#docs)
