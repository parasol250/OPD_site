# OPD_SITE – Описание проекта

## 📌 Назначение
Веб-сервис с функционалом для поиска, фильтрации по цене, добавления в избранное мебели из онлайн-магазинов, с возможностью перехода на страницу товара сайта-источника, с управляемым вручную веб-скрейпингом, с функцией управления пользователями через панель администратора.

## 🛠 Технологии
- **Frontend**: React (папка `src`), сборка в `build`  
- **Backend**: Node.js (`package.json`, `src/database`)  
- **Парсинг**: Python/Scrapy (`scraping/`, `scrapy.cfg`)  
- **БД**: PostgreSQL (дамп-файл в `sql_db/`)  
- **CI/CD**: GitHub Actions (`.github/workflows`)  

## 🚀 Установка
1. Склонировать репозиторий:
   git clone https://github.com/ваш-репозиторий/OPD_SITE.git
2. Установить зависимости:
    npm install
3. Настроить .env

## 🔧 Запуск
1. Restore файла БД в pgAdmin 4:
    sql_db/furniture_aggregator.sql
2. Scraping:
    cd ./scraping
    scrapy crawl dynamic_spider
3. Development:
    npm run dev