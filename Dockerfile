# Используйте официальный образ Node.js в качестве базового образа
FROM node:14

# Установка рабочей директории в контейнере
WORKDIR /app

# Копирование файлов package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование всех файлов вашего React-приложения в контейнер
COPY . .

# Сборка React-приложения
RUN npm run build

# Конечный образ, минимальный исходный образ Nginx
FROM nginx:alpine

# Удалите стандартную стартовую страницу Nginx
RUN rm -rf /usr/share/nginx/html/*

# Копирование собранного React-приложения в корень папки Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Порт, на котором работает Nginx (по умолчанию 80)
EXPOSE 80

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]
