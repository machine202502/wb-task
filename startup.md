# Запуск проекта

## 1. Переменные окружения

Создайте в корне проекта файл `.env` и заполните переменные:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

NODE_ENV=development
APP_PORT=5000

WB_BASE_URL=https://common-api.wildberries.ru
WB_API_TOKEN=

# только для local запуска
GOOGLE_APPLICATION_CREDENTIALS=./googlesheet.json
```

## 2. Токен WB API

`WB_API_TOKEN` — токен доступа к API Wildberries. Его нужно создать в личном кабинете продавца:

- Зайдите в [Личный кабинет продавца WB](https://seller.wildberries.ru)
- **Настройки** → **Доступ к API** (или прямая ссылка: https://seller.wildberries.ru/supplier-settings/access-to-api)
- Создайте новый токен и скопируйте его в `.env` в переменную `WB_API_TOKEN`

Подробнее: [Как создать токен WB API](https://seller.wildberries.ru/instructions/en/ru/material/how-to-create-update-or-delete-a-wb-api-token)

## 3. Ключ Google Sheets

В корне проекта должен лежать файл **`googlesheet.json`** — ключ сервисного аккаунта Google Cloud с доступом к Google Sheets API.

Как получить:

- В [Google Cloud Console](https://console.cloud.google.com/) создайте проект (или выберите существующий)
- Включите **Google Sheets API**
- Создайте сервисный аккаунт (IAM → Service accounts → Create)
- Для этого аккаунта создайте ключ в формате JSON и сохраните файл как `googlesheet.json` в корень проекта

Документация: [Create and delete service account keys | Google Cloud IAM](https://cloud.google.com/iam/docs/keys-create-delete)

Пример структуры файла — смотрите **`example.googlesheet.json`** (подставьте свои данные и переименуйте в `googlesheet.json`).

## 4. Сид таблиц для Google Sheets

Чтобы приложение знало, в какие таблицы выгружать данные, заполните файл **`seed.spreadsheets.json`** в корне проекта: массив ID таблиц (строки).

Пример формата — **`example.seed.spreadsheets.json`**:

```json
["id_таблицы_1", "id_таблицы_2"]
```

При старте приложения сид прочитает этот файл и заполнит таблицу `spreadsheets` в БД. Если файла нет или он пустой — сид не выполняется.

---

После этого запуск: `npm run dev` (разработка - local) или `docker compose up -d` (с Docker).
