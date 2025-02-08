# Серверная часть проекта LV-TRANS

## Содержание

- [Технологии](#технологии)
- [Начало работы](#начало-работы)
- [Миграции базы данных](#миграции-базы-данных)
- [Тестирование](#тестирование)
- [Развертывание в Docker](#развертывание-в-docker)

## Технологии

- [Node.js](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Knex.js](https://knexjs.org/)
- [Multer](https://github.com/expressjs/multer)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)

## Начало работы

### Требования

- [Node.js](https://nodejs.org/) (рекомендуемая версия 20)
- [Docker](https://www.docker.com/)
- [MySQL](https://www.mysql.com/) (если не используете Docker)

### Установка зависимостей

Для установки зависимостей выполните команду:

```sh
npm install
```

### Настройка окружения

Создайте файл `.env` в корне проекта и добавьте ваши данные согласно .env-example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=lvtrans
PORT=5000
```

### Запуск сервера

Запустить сервер можно командой:

```sh
npm start
```

## Миграции базы данных

Для работы с миграциями базы данных используется [Knex.js](https://knexjs.org/). Для применения миграций выполните
следующие шаги:

1. Убедитесь, что база данных существует в вашем СУБД

2. Запустите миграции:

   ```sh
   npx knex migrate:latest --env development
   ```

3. Для отката миграций используйте команду:

   ```sh
   npx knex migrate:rollback --env development
   ```

4. Миграции создаются в папке `migrations`, где вы можете описывать изменения в базе данных.

## Тестирование

В проекте используются юнит-тесты на `Jest`. Чтобы запустить тесты, выполните:

```sh
npm run test
```

## Развертывание в Docker

### Запуск в Docker

1. Собрать и запустить контейнеры:

   ```sh
   docker-compose up -d --build
   ```

2. Проверить работающие контейнеры:

   ```sh
   docker ps
   ```

3. Остановить контейнеры:

   ```sh
   docker-compose down
   ```

## Источники

- [Документация ExpressJS](https://expressjs.com/)
- [Knex.js — Query Builder](https://knexjs.org/)
- [Multer — File Upload Middleware](https://github.com/expressjs/multer)
