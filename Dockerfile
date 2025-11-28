FROM nginx:alpine

# Удаляем дефолтный конфиг nginx
RUN rm -f /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт
EXPOSE 3000

# Nginx запускается автоматически через CMD из базового образа

