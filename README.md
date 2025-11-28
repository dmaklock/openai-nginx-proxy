# OpenAI Proxy

Простой прокси для OpenAI API `/v1/chat/completions` на Node.js Express.

## Установка и запуск

### Через Docker Compose (рекомендуется)

```bash
docker-compose up -d --build
```

### Локально

Установка зависимостей:

```bash
npm install
```

Запуск:

```bash
npm start
```

Или для разработки:

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000` (порт можно изменить через переменную окружения `PORT`).

## Использование

Прокси работает на `http://localhost:3000` и переадресует запросы к `/v1/chat/completions` на `https://api.openai.com/v1/chat/completions`.

### Пример запроса:

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Настройка

Переменные окружения (опционально):
- `PORT` - порт сервера (по умолчанию 3000)
- `OPENAI_API_URL` - URL OpenAI API (по умолчанию https://api.openai.com)

Заголовок `Authorization` передается как есть из клиентского запроса.

