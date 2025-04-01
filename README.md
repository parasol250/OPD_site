# Сервис-агрегатор мебели

1. Общая информация
   
1.1 Название проекта

Сервис-агрегатор мебели по магазинам

1.2 Краткое описание

Разработка веб-платформы, которая собирает, структурирует и предоставляет пользователям информацию о наличии, ценах и характеристиках мебели в различных магазинах.

1.3 Предпосылки

Потребители сталкиваются с трудностями в поиске подходящей мебели из-за разрозненности информации и отсутствия удобного механизма сравнения.

1.4 Проблема

Большое количество мебельных магазинов предлагают товары через разные платформы, что усложняет поиск и сравнение цен и характеристик.

1.5 Цель проекта

Создание удобного сервиса для агрегирования информации о мебели, позволяющего пользователям эффективно искать, сравнивать и анализировать предложения различных магазинов.

1.6 Ожидаемые результаты

Рабочий прототип сервиса-агрегатора мебели с возможностью поиска и фильтрации товаров по различным параметрам.



3. Функциональные требования

2.1 Основные функции

•	Каталог товаров — сбор информации о мебели из разных источников.

•	Веб-скрейпинг — автоматизированный сбор данных с сайтов магазинов.

•	Поиск — поиск товаров по названию, категории и другим параметрам (опционально).

•	Фильтрация — фильтрация по цене, материалу, цвету, размерам, наличию, бренду и магазину.

•	Интеграция с магазинами — возможность перехода на сайт магазина для оформления заказа или запись в каком магазине был этот товар.

•	Избранное — возможность добавления товаров в список избранного.

•	Адаптивность — поддержка работы на мобильных устройствах.

2.2 Панель администратора

•	Управление каталогом (добавление, редактирование, удаление товаров).

•	Импорт данных из магазинов (автоматически через API, веб-скрейпинг или вручную).

•	Управление пользователями и их действиями.

•	Добавление новых сайтов для скрейпинга.

•	Аналитика и статистика посещений.



4. Нефункциональные требования

•	Производительность — быстрая загрузка страниц и поиск по каталогу.

•	Безопасность — защита данных пользователей и данных о мебели.

•	Масштабируемость — возможность увеличения количества магазинов и товаров.

•	Юзабилити — интуитивно понятный интерфейс.

•	Совместимость — кросс-браузерная поддержка.



5. Интеграции и источники данных

•	API магазинов для получения данных о товарах (предусмотреть возможность, но сейчас их нет).

•	Веб-скрейпинг для автоматизированного сбора информации.

•	Возможность ручного добавления источников через панель администратора.

•	Сторонние сервисы аналитики и рейтингов (например, Google Reviews, Яндекс.Маркет).



6. Примерный	технологический стек

•	Frontend: React.js / Vue.js

•	Backend: Node.js / Python (Django, FastAPI)

•	Веб-скрейпинг: Scrapy / Selenium / BeautifulSoup

•	База данных: PostgreSQL / MongoDB



7. Финальный результат

Рабочий веб-сервис с базовым функционалом для поиска, сравнения и фильтрации мебели по магазинам, с возможностью веб-скрейпинга, интеграции API и добавления новых сайтов через панель администратора.

