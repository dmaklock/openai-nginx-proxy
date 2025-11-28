# OpenAI Proxy (Nginx)

Простой nginx прокси для OpenAI API.

## Установка и запуск

### Через Docker Compose (рекомендуется)

```bash
docker-compose up -d
```

### Через Docker

Сборка образа:
```bash
docker build -t openai-proxy .
```

Запуск:
```bash
docker run -d \
  --name openai-proxy \
  -p 3000:3000 \
  openai-proxy
```

### Локально

1. Установите nginx
2. Скопируйте `nginx.conf` в конфигурацию nginx (например, `/etc/nginx/sites-available/openai-proxy`)
3. Создайте симлинк: `sudo ln -s /etc/nginx/sites-available/openai-proxy /etc/nginx/sites-enabled/`
4. Перезапустите nginx: `sudo nginx -s reload`

## Использование

Прокси работает на `http://localhost:3000` и переадресует все запросы к `https://api.openai.com/v1`.

### Пример запроса к /chat/completions:

```bash
curl http://localhost:3000/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Настройка

- Порт можно изменить в `nginx.conf` (строка `listen 3000;`)
- Все запросы проксируются к `https://api.openai.com/v1`
- Заголовок `Authorization` передается как есть из клиентского запроса

