# Проект: "Бэкэнд для сервиса виш-листов"

### Обзор

- Интро
- Методы
- Использование

**Интро**

Это студенческая работа 15 месяца курса "Web-разработчик плюс" Яндек.Практикума. REST-API для фронтэнд части: «kupipodariday-frontend».

**Методы**

Бэкенд реализован на Nest.js с технологией Typescript.

- Подготовлена инфраструктура проекта: nest new kupipodariday.
- Установлены библиотеки – см. package.json.
- Создана база в PostgreSQL – kupipodariday. БД подключена к проекту
- посредством TypeORM.
- С помощью Nest CLI сгенерирован каркас API: пользователи (users), подарки (wishes), списки желаний (wishlists), предложения скинуться на подарок (offers).

**Использование**

После клонирования проекта нужно инициировать зависимости в нем: npm i

Для работы сервера, необходимо создать и положить в корневую папку файл .env, заполненный по шаблону:

  POSTGRES_HOST='localhost'  
  POSTGRES_PORT=5432  
  POSTGRES_USER=’student’  
  POSTGRES_PASSWORD=*****
  POSTGRES_DB=’kupipodariday’
  POSTGRES_SYNCHRONIZE=true
  SERVER_PORT=3000
  JWT_SECRET=’some_string’
  JWT_EXPIERS=24h
  
Запустить проект:
npm run start:dev

Скрипты – см. в файле package.json в корне проекта.


[Ссылка на "kupipodariday-backend" в GitHub](https://github.com/vasaykh2/kupipodariday-backend)
