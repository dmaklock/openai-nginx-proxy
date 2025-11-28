FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --omit=dev

# Копируем код приложения
COPY index.js ./

# Экспонируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "index.js"]

