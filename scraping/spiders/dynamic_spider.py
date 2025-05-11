import scrapy
import psycopg2
from scrapy.exceptions import CloseSpider
from scraping.items import FurnitureItem

class DynamicSpider(scrapy.Spider):
    name = "dynamic_spider"

    def __init__(self, *args, **kwargs):
        super(DynamicSpider, self).__init__(*args, **kwargs)
        self.db_host = "localhost"
        self.db_name = "furniture_aggregator"
        self.db_user = "postgres"
        self.db_password = "0000"
        self.conn = None
        self.shops = {}
        self.categories = {}
        self.website_data = {}
        self.open_spider(self)  # Явно открываем соединение при инициализации


    def open_spider(self, spider):
        """Открытие соединения с БД при запуске паука"""
        try:
            self.logger.info("Попытка подключения к БД...")
            self.conn = psycopg2.connect(
                host=self.db_host,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            self.cursor = self.conn.cursor()
            self.logger.info("Успешное подключение к БД")  # Логируем успех
            self.logger.info("Загрузка магазинов и категорий...")
            self.load_shops_and_categories()
            self.logger.info("Загрузка данных сайтов...")
            self.load_website_data()
            self.logger.info(f"Загружено {len(self.website_data)} активных сайтов")
        except Exception as e:
            self.logger.error(f"Ошибка подключения к БД: {e}")
            raise CloseSpider("Не удалось подключиться к БД")

    def close_spider(self, spider):
        """Закрываем соединение с БД при завершении"""
        if hasattr(self, 'conn') and self.conn:
            self.cursor.close()
            self.conn.close()

    def start_requests(self):
        """Генерация начальных запросов"""
        if not hasattr(self, 'website_data') or not self.website_data:
            # Попробуем переподключиться, если данные не загружены
            try:
                self.open_spider(self)
            except Exception as e:
                self.logger.error(f"Не удалось загрузить данные: {e}")
                return
            
        if not self.website_data:
            self.logger.error("Данные о сайтах не загружены!")
            return

        for url, data in self.website_data.items():
            # Диваны
            if data['category_sofas_selector']:
                yield scrapy.Request(
                    url,
                    callback=self.parse_categories,
                    meta={
                        'original_url': url,
                        'category': 'sofas',
                        'category_selector': data['category_sofas_selector']
                    },
                    dont_filter=True
                )
            
            # Шкафы
            if data['category_wardrobes_selector']:
                yield scrapy.Request(
                    url,
                    callback=self.parse_categories,
                    meta={
                        'original_url': url,
                        'category': 'wardrobes',
                        'category_selector': data['category_wardrobes_selector']
                    },
                    dont_filter=True
                )
            
            # Кровати
            if data['category_beds_selector']:
                yield scrapy.Request(
                    url,
                    callback=self.parse_categories,
                    meta={
                        'original_url': url,
                        'category': 'beds',
                        'category_selector': data['category_beds_selector']
                    },
                    dont_filter=True
                )
            
            # Консоли
            if data['category_consoles_selector']:
                yield scrapy.Request(
                    url,
                    callback=self.parse_categories,
                    meta={
                        'original_url': url,
                        'category': 'consoles',
                        'category_selector': data['category_consoles_selector']
                    },
                    dont_filter=True
                )
            
            # Столы
            if data['category_tables_selector']:
                yield scrapy.Request(
                    url,
                    callback=self.parse_categories,
                    meta={
                        'original_url': url,
                        'category': 'tables',
                        'category_selector': data['category_tables_selector']
                    },
                    dont_filter=True
                )
            
            # Детская мебель
            if data['category_kids_furniture_selector']:
                yield scrapy.Request(
                    url,
                    callback=self.parse_categories,
                    meta={
                        'original_url': url,
                        'category': 'kids_furniture',
                        'category_selector': data['category_kids_furniture_selector']
                    },
                    dont_filter=True
                )

    def load_shops_and_categories(self):
        self.cursor.execute("SELECT id, name FROM shops")
        shops_data = self.cursor.fetchall()
        if not shops_data:
            raise CloseSpider("No shops found in database!")
        self.shops = {name: id for id, name in shops_data}

        #Load categories -  использование  'category' вместо 'category_name'  для поиска в словаре
        self.cursor.execute("SELECT id, name FROM categories")
        categories_data = self.cursor.fetchall()
        self.categories = {name.lower(): id for id, name in categories_data}


    def load_website_data(self):
        # Загружаем конфигурации сайтов, включая селекторы категорий
        self.cursor.execute("""
            SELECT
                sites.site,
                sites.shop_name,
                sites.product_link_selector,
                sites.name_selector,
                sites.description_selector,
                sites.price_selector,
                sites.brand_selector,
                sites.material_selector,
                sites.color_selector,
                sites.dimension_selector,
                sites.weight_selector,
                sites.stock_quantity_selector,
                sites.rating_selector,
                sites.category_sofas_selector,
                sites.category_wardrobes_selector,
                sites.category_beds_selector,
                sites.category_consoles_selector,
                sites.category_tables_selector,
                sites.category_kids_furniture_selector,
                sites.image_selector
            FROM
                sites
            WHERE
                sites.is_active = TRUE;
        """)
        websites_data = self.cursor.fetchall()
        if not websites_data:
            raise CloseSpider("No active website configurations found")

        self.website_data = {}
        for row in websites_data:
            url = row[0]
            self.website_data[url] = {
                'shop_name': row[1],
                'product_link_selector': row[2],
                'name_selector': row[3],
                'description_selector': row[4],
                'price_selector': row[5],
                'brand_selector': row[6],
                'material_selector': row[7],
                'color_selector': row[8],
                'dimension_selector': row[9],
                'weight_selector': row[10],
                'stock_quantity_selector': row[11],
                'rating_selector': row[12],
                'category_sofas_selector': row[13],
                'category_wardrobes_selector': row[14],
                'category_beds_selector': row[15],
                'category_consoles_selector': row[16],
                'category_tables_selector': row[17],
                'category_kids_furniture_selector': row[18],
                'image_selector': row[19],
            }

    def parse_categories(self, response):
        self.logger.info(f"Обработка категорий для {response.url}")
        original_url = response.meta.get('original_url')
        category_selector = response.meta.get('category_selector')
        category_type = response.meta.get('category') # Get the type of category

        self.logger.debug(f"Селектор категории: {category_selector}")

        # Extract category links using the specific selector
        if category_selector:
            category_links = response.css(category_selector).getall()
            self.logger.info(f"Найдено {len(category_links)} ссылок на категории")

            # You can add a check here to see if the category links are absolute or relative
            for category_link in category_links:
                absolute_link = response.urljoin(category_link)
                self.logger.debug(f"Переход по ссылке категории: {absolute_link}")
                yield scrapy.Request(absolute_link, self.parse_products,
                                      meta={'original_url': original_url, 'category': category_type}) # Pass the category type to parse_products
        else:
            self.logger.warning(f"No category selector found for {response.url} for category {category_type}")

    def parse_products(self, response):
        # Извлекаем данные о сайте из базы данных
        original_url = response.meta.get('original_url')
        category_type = response.meta.get('category') # Get the category
        if not self.website_data or original_url not in self.website_data:
            self.logger.error(f"Website data not loaded for {response.url}.")
            return

        selectors = self.website_data[original_url]

        # Извлекаем ссылки на товары, используя селектор товара из базы данных
        product_link_selector = selectors.get('product_link_selector')
        if product_link_selector:
            product_links = response.css(product_link_selector).getall()
        else:
            self.logger.warning(f"No product link selector for {response.url}")
            return

        self.logger.info(f"Found {len(product_links)} product links")

        # Следуем по каждой ссылке на товар и парсим данные о товаре
        for link in product_links:
            absolute_link = response.urljoin(link)  # Преобразуем относительные URL
            yield response.follow(absolute_link, self.parse_product,
                                  meta={'original_url': original_url, 'category': category_type}) # Pass the category type to parse_product

        # Пагинация (пример - настройте на основе фактического сайта)
        next_page = response.css('a.pagination__next::attr(href)').get()
        if next_page:
            absolute_next_page = response.urljoin(next_page)
            yield response.follow(absolute_next_page, self.parse_products,
                                  meta={'original_url': original_url, 'category': category_type}) # Pass the category type to next page

    def parse_product(self, response):
        original_url = response.meta.get('original_url')
        category_type = response.meta.get('category') # Get the category

        if not self.website_data or original_url not in self.website_data:
            self.logger.error(f"Website data not loaded for {response.url}.")
            return

        selectors = self.website_data[original_url] #Assign Values
    
        item = FurnitureItem()

        item["name"] = response.css(selectors.get('name_selector')).get(default='').strip() if selectors.get('name_selector') else None
        # Попробуем альтернативные селекторы, если основной не сработал
        alt_selectors = [
            'h1.product-title::text',
            'h1.title::text',
            'div.product-name h1::text',
            'meta[property="og:title"]::attr(content)'
        ]
        for selector in alt_selectors:
            item["name"] = response.css(selector).get(default='').strip()
            if item["name"]:
                break
        item["description"] = self.extract_description(response, selectors.get('description_selector')) if selectors.get('description_selector') else None
        item["price"] = self.extract_price(response, selectors.get('price_selector')) if selectors.get('price_selector') else None
        item["original_url"] = response.url

        # Shop ID: must exist.
        shop_name = selectors.get('shop_name')

        if shop_name and shop_name in self.shops:
            item["shop_id"] = self.shops[shop_name]
        else:
            self.logger.error(f"Shop '{shop_name}' not found. Skipping item.")
            return  # Skip to the next item

       # Используем категорию из meta, если она есть
        if category_type: # check if category is present
            category_name = category_type  # Use the passed-in category type directly
            if category_name.lower() in self.categories:
                item["category_id"] = self.categories[category_name.lower()]
        
        # Дополнительная проверка по селектору, если категория еще не определена
        if not item.get("category_id") and selectors.get('category_selector'):
            category_name = response.css(selectors.get('category_selector')).get(default='').strip()
            if category_name.lower() in self.categories:
                item["category_id"] = self.categories[category_name.lower()]
        
        # Если категория все еще не определена, используем категорию по умолчанию
        if not item.get("category_id"):
            item["category_id"] = 1  # ID категории по умолчанию

        item["brand"] = self.extract_brand(response, selectors.get('brand_selector')) if selectors.get('brand_selector') else None
        item["material"] = self.extract_material(response, selectors.get('material_selector')) if selectors.get('material_selector') else None
        item["color"] = self.extract_color(response, selectors.get('color_selector')) if selectors.get('color_selector') else None
        item["dimension"] = self.extract_dimension(response, selectors.get('dimension_selector')) if selectors.get('dimension_selector') else None
        item["weight"] = self.extract_weight(response, selectors.get('weight_selector')) if selectors.get('weight_selector') else None
        item["stock_quantity"] = self.extract_stock_quantity(response, selectors.get('stock_quantity_selector')) if selectors.get('stock_quantity_selector') else None
        item["rating"] = self.extract_rating(response, selectors.get('rating_selector')) if selectors.get('rating_selector') else None
        
        # Извлечение только главного изображения
        image_selector = selectors.get('image_selector')
        if image_selector:
            image_url = response.css(image_selector).get()
            if image_url:
                absolute_image_url = response.urljoin(image_url) # Преобразуем относительный URL
                item['image_urls'] = [absolute_image_url]
            else:
                item['image_urls'] = []
                self.logger.warning(f"No image found for {response.url} using selector {image_selector}")
        else:
            item['image_urls'] = []
            self.logger.warning(f"No image selector defined for {response.url}")

        yield item

    def map_category_name(self, url_category):
        """Сопоставляет часть URL с названием категории в БД"""
        mapping = {
            'kukhni': 'Кухни',
            'divany': 'Диваны и кресла',
            'shkafy': 'Шкафы и стеллажи',
            'krovati': 'Кровати и матрасы',
            'kombinirovannye-gostinye': 'Гостиные',
            'detskaya-mebel': 'Детская мебель'
        }
        return mapping.get(url_category, url_category)

    def extract_description(self, response, selector):
        if selector:
            description_parts = response.css(selector).getall()
            return "\n".join([part.strip() for part in description_parts]) if description_parts else None
        return None

    def extract_price(self, response, selector):
        if selector:
            price_string = response.css(selector).get()
            if price_string:
                try:
                    return float(price_string.replace(" ", ""))
                except ValueError:
                    return None
        return None

    def extract_dimension(self, response, selector):
        if selector:
            dimension_element = response.css(selector).get()
            if dimension_element:
                return dimension_element.strip()
        return None

    def extract_weight(self, response, selector):
        if selector:
            weight_element = response.css(selector).get()
            if weight_element:
                try:
                    weight_value = weight_element.strip().split(" ")[0]
                    return float(weight_value)
                except ValueError:
                    return None
        return None

    def extract_color(self, response, selector):
        if selector:
            color_element = response.css(selector).get()
            if color_element:
                return color_element.strip()
        return None

    def extract_material(self, response, selector):
        if selector:
            material_element = response.css(selector).get()
            if material_element:
                return material_element.strip()
        return None

    def extract_stock_quantity(self, response, selector):
       if selector:
            stock_element = response.css(selector).get()
            try:
                return int(stock_element) if stock_element else None
            except (ValueError, TypeError):
                return None

    def extract_rating(self, response, selector):
        if selector:
            rating_element = response.css(selector).get()
            try:
                return float(rating_element) if rating_element else None
            except (ValueError, TypeError):
                return None

    def extract_brand(self, response, selector):
        if selector:
            brand_element = response.css(selector).get()
            if brand_element:
                return brand_element.strip()
        return None