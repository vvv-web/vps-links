#!/usr/bin/env bash
# Публикует markdown-страницу в Wiki.js через GraphQL (требуется API key из админки).
# Использование:
#   export WIKIJS_API_TOKEN='...'
#   ./publish-page.sh [path-to.md]
# Переменные окружения:
#   WIKIJS_BASE_URL   — по умолчанию https://wiki.acom-offer-desk.ru
#   WIKIJS_PAGE_ID    — по умолчанию 2 (services/converter)
#   WIKIJS_PAGE_PATH  — по умолчанию services/converter
#   WIKIJS_LOCALE     — по умолчанию en
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WIKIJS_BASE_URL="${WIKIJS_BASE_URL:-https://wiki.acom-offer-desk.ru}"
MD_FILE="${1:-$SCRIPT_DIR/../pages/services-converter.md}"

if [[ ! -f "$MD_FILE" ]]; then
  echo "Файл не найден: $MD_FILE" >&2
  exit 1
fi

if [[ -z "${WIKIJS_API_TOKEN:-}" ]]; then
  echo "Задайте WIKIJS_API_TOKEN (Administration → API Access в Wiki.js)." >&2
  exit 1
fi

WIKIJS_PAGE_ID="${WIKIJS_PAGE_ID:-2}"
WIKIJS_PAGE_PATH="${WIKIJS_PAGE_PATH:-services/converter}"
WIKIJS_LOCALE="${WIKIJS_LOCALE:-en}"
TITLE="${WIKIJS_PAGE_TITLE:-Converter}"
DESCRIPTION="${WIKIJS_PAGE_DESCRIPTION:-Подробный service-runbook для проекта Converter: состав, запуск, проверки и диагностика.}"

QUERY="$(cat <<'GQL'
mutation ($id: Int!, $content: String!, $description: String!, $editor: String!, $isPublished: Boolean!, $locale: String!, $path: String!, $title: String!) {
  pages {
    update(
      id: $id
      content: $content
      description: $description
      editor: $editor
      isPublished: $isPublished
      locale: $locale
      path: $path
      title: $title
    ) {
      responseResult {
        succeeded
        errorCode
        message
      }
    }
  }
}
GQL
)"

VARS_JSON="$(jq -n \
  --arg content "$(cat "$MD_FILE")" \
  --arg description "$DESCRIPTION" \
  --arg editor "markdown" \
  --arg locale "$WIKIJS_LOCALE" \
  --arg path "$WIKIJS_PAGE_PATH" \
  --arg title "$TITLE" \
  --argjson id "$WIKIJS_PAGE_ID" \
  --argjson isPublished true \
  '{
    id: $id,
    content: $content,
    description: $description,
    editor: $editor,
    isPublished: $isPublished,
    locale: $locale,
    path: $path,
    title: $title
  }')"

BODY="$(jq -n \
  --arg query "$QUERY" \
  --argjson variables "$VARS_JSON" \
  '{query: $query, variables: $variables}')"

RESP="$(curl -fsS "$WIKIJS_BASE_URL/graphql" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $WIKIJS_API_TOKEN" \
  -d "$BODY")"

echo "$RESP" | jq .

if echo "$RESP" | jq -e '.errors != null and (.errors | length) > 0' >/dev/null; then
  exit 1
fi

if ! echo "$RESP" | jq -e '.data.pages.update.responseResult.succeeded == true' >/dev/null; then
  echo "Обновление не подтверждено (succeeded != true)." >&2
  exit 1
fi

echo "OK: страница $WIKIJS_PAGE_PATH обновлена."
