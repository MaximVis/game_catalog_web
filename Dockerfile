# Используем официальный образ PHP с FPM
FROM php:8.3-fpm

# Устанавливаем системные зависимости включая PostgreSQL
RUN apt-get update && apt-get install -y \
    nginx \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

# Создаем директории для загрузки файлов
RUN mkdir -p /var/www/html/uploads/game_imgs /var/www/html/uploads/devs_imgs \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 755 /var/www/html/uploads

# Копируем конфигурации
COPY nginx.conf /etc/nginx/sites-available/default
COPY --chown=www-data:www-data . /var/www/html

# Устанавливаем рабочую директорию
WORKDIR /var/www/html

# Создаем симлинк для nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Открываем порт
EXPOSE 80

# Запускаем сервисы
CMD sh -c "php-fpm -D && nginx -g 'daemon off;'"
