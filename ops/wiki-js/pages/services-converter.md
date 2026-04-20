# Converter

## Обзор

`Converter` — микросервисный прототип для:

- ведения НСИ: единицы измерения, категории, номенклатура, упаковки, правила конвертации;
- расчета накладных;
- генерации итоговых файлов `XLSX` и `PDF`;
- хранения файлов в `MinIO`;
- авторизации и ролей через `Keycloak`.

Эта страница нужна как короткий service-runbook: что входит в контур, как его поднять, как проверить состояние и куда смотреть при типовых сбоях.

## Production, репозиторий и витрина

- **Публичный URL:** https://converter.acom-offer-desk.ru/
- **Карточка витрины (VPS Links):** https://vvv-web.github.io/vps-links/projects/converter/
- **Репозиторий (форк):** https://github.com/vvv-web/converter
- **Upstream:** https://github.com/vldsmelov/converter
- **Ветка выката на VPS:** `test` (целевое состояние: tip ветки `test` на форке совпадает с `vldsmelov/converter:test`). Ветка **`prototype`** на форке может расходиться с `test` — не считать её копией актуального кода без явной сверки.
- **RUNBOOK в Git (ветка `test`):** https://github.com/vvv-web/converter/blob/test/docs/RUNBOOK.md — канон по сервисам, портам, health и командам `docker compose` (§1–§9). Если в репозитории появится раздел **§10 VPS** (после влития upstream), операционные факты с VPS держите в нём и на этой странице в согласованном виде.

## VPS: каталог и ограничения

- **Каталог деплоя на сервере:** `/opt/converter`.
- Команды **деплоя**, `docker compose`, просмотр логов и типовая диагностика **боевого** контура выполняются **только на VPS** из каталога деплоя (а не из произвольной локальной копии репозитория).
- При сомнениях в версии на сервере сверяйте фактический ref (`git rev-parse HEAD`) и состояние контейнеров с ожидаемым выкатом ветки `test`.

## Состав сервиса

| Сервис | Назначение | Порты по умолчанию |
|--------|------------|---------------------|
| `keycloak` | Аутентификация и авторизация | `8080` |
| `nsi` | Справочники и правила | `8001` |
| `documents` | Накладные, расчеты и генерация файлов | `8002` |
| `conversion` | Расчет конвертации по данным NSI | `8003` |
| `documents_worker` | Celery worker для фоновых задач | - |
| `rabbitmq` | Брокер задач Celery | `5672`, `15672` |
| `minio` | Объектное хранилище файлов | `9000`, `9001` |

## Основной поток данных

1. Пользователь проходит аутентификацию через `Keycloak`.
2. UI создает накладную в `documents`.
3. `documents` запускает задачу `calculate_invoice`.
4. Задача получает service-token `documents-service` и вызывает `conversion`.
5. `conversion` читает данные NSI и возвращает результат конвертации.
6. `documents` сохраняет `ConvertedLine`.
7. `documents` запускает генерацию `XLSX/PDF` и кладет файлы в `MinIO`.

## Быстрый запуск и точки входа

1. Подготовить переменные окружения:
   - Linux/macOS: `cp .env.example .env`
   - Windows (PowerShell): `Copy-Item .env.example .env -Force`
2. Поднять backend-контур:
   - `docker compose up -d --build`
3. Поднять frontend:
   - `docker compose --profile ui up -d frontend`
4. Открыть в браузере (локально):
   - UI: `http://localhost:5173`
   - Keycloak: `http://localhost:8080`

## Проверка работоспособности

Ниже приведены типичные URL для **локальной** разработки. Для **production** тот же **контракт** проверок, что в `docs/RUNBOOK.md` §4: **`GET /healthz`** для сервисов **`nsi`**, **`documents`**, **`conversion`**. Конкретные хосты и маршруты на VPS зависят от reverse proxy и внутренних портов compose — ориентир по смыслу и командам: [RUNBOOK на ветке test](https://github.com/vvv-web/converter/blob/test/docs/RUNBOOK.md).

### Health-check

- NSI: `http://localhost:8001/healthz`
- Documents: `http://localhost:8002/healthz`
- Conversion: `http://localhost:8003/healthz`

### Дополнительные проверки

- OpenAPI:
  - NSI: `/api/schema/`, `/api/docs/`
  - Documents: `/api/schema/`, `/api/docs/`
- Контейнеры:
  - `docker compose ps`
- Логи:
  - `docker compose logs --tail 200 documents documents_worker conversion nsi`

## Что уже реализовано

### НСИ

- **Единицы измерения:** список, создание, редактирование, удаление.
- **Категории номенклатуры:** список, создание, редактирование, удаление.
- **Номенклатура:** список, создание, редактирование.
- **Упаковки:** список, создание, редактирование, удаление.
- **Правила:** список во вкладках — глобальные, правила категорий и правила номенклатуры; для каждого типа доступны создание, редактирование и удаление.

### Накладные

- Создание накладной.
- Проверка наличия правил конвертации при вводе строк.
- Расчет `calculate`.
- Генерация итоговых файлов `generate`.
- Скачивание `XLSX/PDF`.

## Экспорт файлов

- В итоговых `XLSX/PDF` используется русский набор колонок: `#`, `Товар`, `Кол-во`, `ЕИ (в документе)`, `Оприходование`, `Статус строки`.
- В колонке `Товар` записывается **название номенклатуры**, а не `item_id`.
- Имя товара определяется в таком порядке:
  1. `line.context.item_name`, если передан;
  2. fallback-запрос в NSI по `item_id`;
  3. резервный вариант `item_id=...`.
- Для корректной печати кириллицы в PDF используется `DejaVuSans`; в Docker-образ `documents` добавлена установка пакета `fonts-dejavu-core`.

## Роли и доступ

Основные роли в `Keycloak`:

- **NSI:** `nsi.uom.*`, `nsi.item.*`, `nsi.package.*`, `nsi.rule.*`
- **Conversion:** `conversion.convert`, `conversion.ping`
- **Documents:** `documents.invoice.read`, `documents.invoice.write`, `documents.invoice.calculate`, `documents.invoice.generate`

## Полезные команды

### Базовые операции

- Полный перезапуск:
  - `docker compose down -v --remove-orphans`
  - `docker compose up -d --build`
- Пересобрать и перезапустить только документы:
  - `docker compose up -d --build documents documents_worker`
- Поднять UI:
  - `docker compose --profile ui up -d frontend`
- Ручной сидинг:
  - `docker compose run --rm seed`

### Сборка и тесты

- Сборка frontend:
  - `docker run --rm -v ${PWD}:/repo -w /repo/frontend node:20-alpine sh -lc "npm ci && npm run build"`
- E2E smoke:
  - `docker compose --profile tools run --rm e2e pytest -q tests/test_invoice_flow.py`
  - `docker compose --profile tools run --rm e2e pytest -q tests/test_end_to_end.py`
- Python smoke для `documents`:
  - `docker compose run --rm documents python -m py_compile apps/documents_core/rendering.py apps/documents_core/tasks.py`

## Диагностика типовых проблем

### PDF ошибка по кириллице

**Симптом:** в логах появляется ошибка про `Helvetica` и unsupported characters.

**Что проверить:** пересобран ли и перезапущен ли контейнер `documents`.

**Команда:**

- `docker compose up -d --build documents documents_worker`

### Файл с устаревшими колонками

**Причина:** файл был сгенерирован до обновления рендера.

**Что делать:** повторно выполнить генерацию `XLSX/PDF` на карточке накладной.

### В колонке `Товар` снова виден `item_id`

Проверить:

- отправляет ли frontend `context.item_name`;
- может ли `documents` сходить в NSI;
- корректно ли заданы `NSI_BASE_URL` и service-token для внутренних вызовов.

## CI и проверки

Краткий ориентир по автоматическим проверкам:

- `frontend-build`: `npm ci && npm run build`
- `python-smoke`: compile/check python
- `e2e-smoke`: поднимает compose-контур и выполняет end-to-end проверки

## Связанные документы

- `README.md` проекта, ветка **`test`:** https://github.com/vvv-web/converter/blob/test/README.md
- Операционный runbook, ветка **`test`:** https://github.com/vvv-web/converter/blob/test/docs/RUNBOOK.md
- `frontend/README.md` в репозитории (ветку уточняйте по политике команды; для выката ориентир — **`test`**).

## Ограничения публикации

На этой странице сознательно **не публикуются**:

- пароли и любые учетные данные по умолчанию;
- приватные ключи и токены;
- детали административного сброса данных;
- чувствительные процедуры восстановления, которые должны жить только в приватной операционной документации.

Если нужен доступ к таким данным, использовать приватный контур документации и менеджер секретов, а не публично-читаемую wiki.
