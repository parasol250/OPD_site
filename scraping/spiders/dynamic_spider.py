import scrapy
import psycopg2
import datetime
from scrapy.exceptions import CloseSpider

from scraping.items import FurnitureItem

#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Default CSS selectors (наиболее часто встречающиеся, подлежат уточнению)
DEFAULT_SELECTORS = {
    'product_link_selector': 'a::attr(href)',  # Обобщенный селектор ссылок
    'name_selector': 'h1::text',
    'description_selector': 'p::text',
    'price_selector': '.price::text',
    'brand_selector': None, 
    'material_selector': None,
    'color_selector': None,
    'dimension_selector': None,
    'weight_selector': None,
    'stock_quantity_selector': None,
    'rating_selector': None,
}

class DynamicSpider(scrapy.Spider):
    name = "dynamic_spider"

    def __init__(self, *args, **kwargs):
        super(DynamicSpider, self).__init__(*args, **kwargs)
        #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        self.db_host = "localhost"
        self.db_name = "furniture_aggregator"  
        self.db_user = "postgres" # Your DB User
        self.db_password = "0000" # Your DB pass
        self.conn = None
        self.shops = {} #Stores shop IDS by Name

    def start_requests(self):
        try:
            self.conn = psycopg2.connect(
                host=self.db_host,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            self.cursor = self.conn.cursor()

            # Pre-load Shops information into "shops" attribute
            self.cursor.execute("SELECT id, name FROM shops")
            shops_data = self.cursor.fetchall()
            if not shops_data:
                raise CloseSpider("No shops found in database!")
            self.shops = {name: id for id, name in shops_data}

            #Fetch all website from the table
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
                    sites.rating_selector
                FROM
                    sites
                WHERE
                    sites.is_active = TRUE;
                """)

            websites_data = self.cursor.fetchall()

            if not websites_data:
                raise CloseSpider("No active website configurations found")

             #Store data in this format {URL:{ shop_name:name,
             #   product_link_selector: data,
             #   name_selector : data ....
             #   }}
            self.website_data = {}
            for row in websites_data:
                url = row[0] # index site data is on 0
                self.website_data[url] = {
                    'shop_name': row[1], # index shop_name data is on 1
                    'product_link_selector': row[2] if row[2] else DEFAULT_SELECTORS['product_link_selector'], # index product_link_selector data is on 2
                    'name_selector': row[3] if row[3] else DEFAULT_SELECTORS['name_selector'],
                    'description_selector': row[4] if row[4] else DEFAULT_SELECTORS['description_selector'],
                    'price_selector': row[5] if row[5] else DEFAULT_SELECTORS['price_selector'],
                    'brand_selector': row[6] if row[6] else DEFAULT_SELECTORS['brand_selector'],
                    'material_selector': row[7] if row[7] else DEFAULT_SELECTORS['material_selector'],
                    'color_selector': row[8] if row[8] else DEFAULT_SELECTORS['color_selector'],
                    'dimension_selector': row[9] if row[9] else DEFAULT_SELECTORS['dimension_selector'],
                    'weight_selector': row[10] if row[10] else DEFAULT_SELECTORS['weight_selector'],
                    'stock_quantity_selector': row[11] if row[11] else DEFAULT_SELECTORS['stock_quantity_selector'],
                    'rating_selector': row[12] if row[12] else DEFAULT_SELECTORS['rating_selector'],
                }

            self.start_urls = list(self.website_data.keys())  # Get URLs from website_data

        except psycopg2.Error as e:
            self.logger.error(f"Database connection error: {e}")
            raise CloseSpider("Failed to connect to the database")

        except Exception as e:
            self.logger.error(f"Error fetching website configuration: {e}")
            raise CloseSpider("Failed to fetch website configuration")

        finally:
            if self.conn:
                self.cursor.close()
                self.conn.close()

        for url in self.start_urls:
            yield scrapy.Request(
                url,
                callback=self.parse,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://hoff.ru/',
                },
                cookies={
                    'region_id': '1',  # ID региона (Москва)
                    'city_id': '1',    # ID города
                },
                meta={'original_url': url},
                dont_filter=True
            )
            # url, 
            # self.parse, 
            # meta={'original_url': url},
            # headers={
            #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            #     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            #     'Accept-Language': 'en-US,en;q=0.5',
            # },
            # dont_filter=True
            # )
            #yield scrapy.Request(url, self.parse, meta={'original_url': url})

    def parse(self, response):
        original_url = response.meta.get('original_url')
        if not self.website_data or original_url not in self.website_data:
            self.logger.error(f"Website data not loaded for {response.url}.")
            return

        selectors = self.website_data[original_url]
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
        original_url = response.meta.get('original_url')
        selectors = self.website_data[original_url]

        item = FurnitureItem()
        
        # Основные данные
        item['name'] = response.css(selectors.get('name_selector')).get('').strip()
        item['price'] = self.extract_price(response.css(selectors.get('price_selector')).get(''))
        item['link'] = response.url
        item['store'] = selectors.get('shop_name', 'Hoff')
        
        # Изображения
        images = response.css('img.product-gallery__image::attr(src)').getall()
        item['image'] = images[0] if images else None
        
        # Категория из хлебных крошек
        item['category'] = ' > '.join(response.css('.breadcrumbs__item span::text').getall()[1:])
        
        # Характеристики
        specs = {}
        for spec in response.css('.product-specifications__row'):
            name = spec.css('.product-specifications__name::text').get('').strip()
            value = spec.css('.product-specifications__value::text').get('').strip()
            if name and value:
                specs[name.lower()] = value
        
        item['brand'] = specs.get('бренд')
        item['material'] = specs.get('материал')
        item['color'] = specs.get('цвет')
        item['dimension'] = specs.get('габариты') or specs.get('размеры')
        item['weight'] = specs.get('вес')
        
        # Описание
        description = ' '.join(response.css('.product-description__text *::text').getall()).strip()
        item['description'] = description if description else None
        
        # Наличие
        stock = response.css('.product-actions__availability::text').get('')
        item['stock_quantity'] = 1 if 'есть' in stock.lower() else 0
        
        # Рейтинг
        rating = response.css('.product-feedback__rating-value::text').get()
        item['rating'] = float(rating) if rating else None

        # item["name"] = response.css(selectors.get('name_selector')).get(default='').strip() if selectors.get('name_selector') else None
        # item["description"] = self.extract_description(response, selectors.get('description_selector')) if selectors.get('description_selector') else None
        # item["price"] = self.extract_price(response, selectors.get('price_selector')) if selectors.get('price_selector') else None
        # item["original_url"] = response.url

        # # Shop ID: must exist.
        # shop_name = selectors.get('shop_name')

        # if shop_name and shop_name in self.shops:
        #     item["shop_id"] = self.shops[shop_name]
        # else:
        #     self.logger.error(f"Shop '{shop_name}' not found. Skipping item.")
        #     return  # Skip to the next item

        # item["brand"] = self.extract_brand(response, selectors.get('brand_selector')) if selectors.get('brand_selector') else None
        # item["material"] = self.extract_material(response, selectors.get('material_selector')) if selectors.get('material_selector') else None
        # item["color"] = self.extract_color(response, selectors.get('color_selector')) if selectors.get('color_selector') else None
        # item["dimension"] = self.extract_dimension(response, selectors.get('dimension_selector')) if selectors.get('dimension_selector') else None
        # item["weight"] = self.extract_weight(response, selectors.get('weight_selector')) if selectors.get('weight_selector') else None
        # item["stock_quantity"] = self.extract_stock_quantity(response, selectors.get('stock_quantity_selector')) if selectors.get('stock_quantity_selector') else None
        # item["rating"] = self.extract_rating(response, selectors.get('rating_selector')) if selectors.get('rating_selector') else None
        yield item

    def extract_description(self, response, selector):
        if selector:
            description_parts = response.css(selector).getall()
            return "\n".join([part.strip() for part in description_parts]) if description_parts else None
        return None

    # def extract_price(self, response, selector):
    #     if selector:
    #         price_string = response.css(selector).get()
    #         if price_string:
    #             try:
    #                 return float(price_string.replace(" ", ""))
    #             except ValueError:
    #                 return None
    #     return None

    def extract_price(self, price_string):
    # """Особая обработка цен Hoff, которые могут быть в формате '99 990 ₽'"""
        if price_string:
            try:
                # Удаляем все нецифровые символы, кроме точки и запятой
                price = ''.join(c for c in price_string if c.isdigit())
                return float(price) if price else None
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