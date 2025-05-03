import scrapy
import psycopg2
import random
import time
from scrapy.exceptions import CloseSpider
from scrapy.http import Request
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Конфигурация (вынесена в начало файла)
PROXY_LIST = [
    'http://94.230.127.180:1080',
    'http://84.53.245.42:41258',
    'http://194.186.248.97:80',
    'http://94.103.86.110:13485',
    'http://80.87.192.7:3128',
    'http://46.47.197.210:3128',
]

# Глобальная конфигурация
USE_SELENIUM = False  # Измените на True для использования Selenium
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]

class DynamicSpider(scrapy.Spider):
    name = "dynamic_spider"
    
    custom_settings = {
        'RETRY_TIMES': 3,
        'RETRY_HTTP_CODES': [401, 403, 407, 429, 500, 502, 503, 504],
        'DOWNLOAD_DELAY': 10,
        'CONCURRENT_REQUESTS': 1,
        'COOKIES_ENABLED': True,
        'DOWNLOAD_TIMEOUT': 60,
        'HTTPERROR_ALLOWED_CODES': [401, 403],
        'USER_AGENT': random.choice(USER_AGENTS),
        'ROTATING_PROXY_LIST': PROXY_LIST,
        'DOWNLOADER_MIDDLEWARES': {
            'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
            'scrapy_user_agents.middlewares.RandomUserAgentMiddleware': 400,
            'rotating_proxies.middlewares.RotatingProxyMiddleware': 610,
            'rotating_proxies.middlewares.BanDetectionMiddleware': 620,
        },
    }

    def __init__(self, *args, **kwargs):
        super(DynamicSpider, self).__init__(*args, **kwargs)
        self.db_host = "localhost"
        self.db_name = "furniture_aggregator"
        self.db_user = "postgres"
        self.db_password = "0000"
        self.conn = None
        self.shops = {}
        self.failed_urls = {}
        self.website_data = {}  # Добавлено для хранения данных о сайтах
        self.driver = None  # Инициализация драйвера
        
        if USE_SELENIUM:
            try:
                chrome_options = Options()
                chrome_options.add_argument("--headless")
                chrome_options.add_argument("--disable-gpu")
                chrome_options.add_argument("--no-sandbox")
                self.driver = webdriver.Chrome(options=chrome_options)
            except Exception as e:
                self.logger.error(f"Failed to initialize Selenium: {e}")

    def get_random_headers(self, url):
        domain = urlparse(url).netloc
        return {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': f'https://{domain}/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }

    def start_requests(self):
        try:
            self.conn = psycopg2.connect(
                host=self.db_host,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            self.cursor = self.conn.cursor()

            # Загрузка данных о магазинах
            self.cursor.execute("SELECT id, name FROM shops")
            self.shops = {name: id for id, name in self.cursor.fetchall()}
            
            # Загрузка данных о сайтах
            self.cursor.execute("""
                SELECT site, shop_name, product_link_selector, name_selector, 
                       description_selector, price_selector, brand_selector,
                       material_selector, color_selector, dimension_selector,
                       weight_selector, stock_quantity_selector, rating_selector
                FROM sites WHERE is_active = TRUE
            """)
            
            for row in self.cursor.fetchall():
                self.website_data[row[0]] = {
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
                }

            # Создание запросов
            for url in self.website_data.keys():
                if USE_SELENIUM and self.driver:
                    yield self.selenium_request(url, self.website_data[url]['shop_name'])
                else:
                    yield Request(
                        url,
                        callback=self.parse,
                        headers=self.get_random_headers(url),
                        meta={'original_url': url},
                        dont_filter=True
                    )

        except Exception as e:
            self.logger.error(f"Initialization error: {e}")
            raise CloseSpider(f"Initialization failed: {str(e)}")
        finally:
            if self.conn:
                self.cursor.close()
                self.conn.close()

    def selenium_request(self, url, shop_name):
        try:
            self.driver.get(url)
            time.sleep(random.uniform(3, 7))
            
            if self.check_captcha():
                self.solve_captcha()
                
            cookies = {c['name']: c['value'] for c in self.driver.get_cookies()}
            
            return Request(
                url,
                callback=self.parse,
                headers=self.get_random_headers(url),
                cookies=cookies,
                meta={
                    'original_url': url,
                    'shop_name': shop_name,
                    'dont_retry': True,
                },
                dont_filter=True
            )
        except Exception as e:
            self.logger.error(f"Selenium error for {url}: {e}")
            return None

    def check_captcha(self):
        try:
            return bool(self.driver.find_element(By.ID, 'captcha'))
        except:
            return False

    def solve_captcha(self):
        time.sleep(10)  # Временное решение для ручного ввода
        return True

    def parse(self, response):
        if response.status in [401, 403]:
            self.logger.warning(f"Access denied for {response.url}")
            return
            
        original_url = response.meta.get('original_url')
        selectors = self.website_data.get(original_url, {})
        
        product_link_selector = selectors.get('product_link_selector')

        if product_link_selector:
            product_links = response.css(product_link_selector).getall()
            for link in product_links:
                yield response.follow(link, self.parse_product, meta={'original_url':original_url})

        # Pagination handling (example - adjust as needed)
        next_page = response.css("a.pagination__next::attr(href)").get()
        if next_page:
            yield response.follow(next_page, self.parse, meta={'original_url':original_url})

    def parse_product(self, response):
        if response.status in [401, 403]:
            self.logger.warning(f"Access denied for {response.url}")
            return
        original_url = response.meta.get('original_url')
        selectors = self.website_data[original_url]

        item = FurnitureItem()
        ################################################################3
        item["name"] = response.css(selectors.get('name_selector')).get(default='').strip() if selectors.get('name_selector') else None
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

        item["brand"] = self.extract_brand(response, selectors.get('brand_selector')) if selectors.get('brand_selector') else None
        item["material"] = self.extract_material(response, selectors.get('material_selector')) if selectors.get('material_selector') else None
        item["color"] = self.extract_color(response, selectors.get('color_selector')) if selectors.get('color_selector') else None
        item["dimension"] = self.extract_dimension(response, selectors.get('dimension_selector')) if selectors.get('dimension_selector') else None
        item["weight"] = self.extract_weight(response, selectors.get('weight_selector')) if selectors.get('weight_selector') else None
        item["stock_quantity"] = self.extract_stock_quantity(response, selectors.get('stock_quantity_selector')) if selectors.get('stock_quantity_selector') else None
        item["rating"] = self.extract_rating(response, selectors.get('rating_selector')) if selectors.get('rating_selector') else None
        yield item

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

    def closed(self, reason):
        if hasattr(self, 'driver') and self.driver:
            self.driver.quit()