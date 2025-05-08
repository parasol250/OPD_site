from scrapy.pipelines.images import ImagesPipeline
from scrapy.exceptions import DropItem
import scrapy
import psycopg2
import os
from urllib.parse import urlparse

class FurnitureImagesPipeline(ImagesPipeline):
    def get_media_requests(self, item, info):
        # Проверяем наличие image_urls в item
        if 'image_urls' not in item or not item['image_urls']:
            raise DropItem("Item contains no image_urls")
        
        for image_url in item.get('image_urls', []):
            yield scrapy.Request(image_url, meta={'product_url': item['original_url']})

    def file_path(self, request, response=None, info=None, *, item=None):
        # Обратите внимание на новый параметр item=None
        product_url = request.meta['product_url']
        url_hash = str(abs(hash(product_url)))[:8]
        image_name = request.url.split('/')[-1].split('?')[0]
        return f'full/{url_hash}_{image_name}'

    def item_completed(self, results, item, info):
        # Преобразуем результаты в список путей
        image_paths = [x['path'] for ok, x in results if ok]
        
        if not image_paths:
            raise DropItem("No images were downloaded")
            
        # Сохраняем пути в item
        if 'image_paths' not in item.fields:
            raise DropItem("Item class doesn't support image_paths field")
            
        item['image_paths'] = image_paths
        return item

class FurniturePipeline:
    def __init__(self):
        self.db_host = "localhost"
        self.db_name = "furniture_aggregator"  # Replace
        self.db_user = "postgres"  # Replace
        self.db_password = "0000"  # Replace
        self.conn = None
        self.cursor = None

    def open_spider(self, spider):
        try:
            self.conn = psycopg2.connect(
                host=self.db_host,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            # self.cursor = self.conn.cursor()
        except psycopg2.Error as e:
            spider.logger.error(f"Database connection error: {e}")
            raise

    def close_spider(self, spider):
        if hasattr(self, 'cursor') and self.cursor:
            self.cursor.close()
        if hasattr(self, 'conn') and self.conn:
            self.conn.close()


    def process_item(self, item, spider):
        cursor = None
        try:
            # Создаем новый курсор для каждого item
            cursor = self.conn.cursor()
            # Проверяем существование товара
            cursor.execute("SELECT id FROM products WHERE original_url = %s", (item['original_url'],))        
            exists = cursor.fetchone()
            
            if exists:
                # Обновляем существующий товар
                cursor.execute("""
                    UPDATE products 
                    SET images = %s, 
                        image_paths = %s,
                        updated_at = NOW()
                    WHERE original_url = %s
                """, (
                    item.get('image_urls', []),
                    item.get('image_paths', []),
                    item['original_url']
                ))
            else:
                # Вставляем новый товар
                cursor.execute("""
                    INSERT INTO products (
                        name, description, price, original_url, shop_id,
                        brand, material, color, dimensions, weight,
                        stock_quantity, rating, images, image_paths
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    item.get('name'), item.get('description'), item.get('price'),
                    item.get('original_url'), item.get('shop_id'), item.get('brand'),
                    item.get('material'), item.get('color'), item.get('dimensions'),
                    item.get('weight'), item.get('stock_quantity'), item.get('rating'),
                    item.get('image_urls', []),
                    item.get('image_paths', [])
                ))
            
            self.conn.commit()
        except Exception as e:
            spider.logger.error(f"Database error: {e}")
            if self.conn and not self.conn.closed:
                self.conn.rollback()
            raise self.DropItem(f"Database error: {e}")
        finally:
            if cursor and not cursor.closed:
                cursor.close()
        
        return item
        # try:
        #     # Сначала проверяем существование записи
        #     self.cursor.execute(
        #         "SELECT id FROM products WHERE original_url = %s",
        #         (item['original_url'],))
            
        #     if self.cursor.fetchone():
        #         # Запись уже существует, можно обновить
        #         spider.logger.debug(f"Product already exists: {item['original_url']}")
        #     else:
        #         # Вставляем новую запись
        #         columns = ['name', 'original_url', 'shop_id']
        #         values = [item['name'], item['original_url'], item['shop_id']]

        #         # Добавляем остальные поля
        #         optional_fields = [
        #             'description', 'price', 'brand', 'material',
        #             'color', 'dimension', 'weight', 'stock_quantity', 'rating'
        #         ]
                
        #         for field in optional_fields:
        #             if field in item and item[field] is not None:
        #                 columns.append(field)
        #                 values.append(item[field])

        #         placeholders = ', '.join(['%s'] * len(columns))
        #         columns_sql = ', '.join(columns)
                
        #         query = f"""
        #             INSERT INTO products ({columns_sql})
        #             VALUES ({placeholders})
        #         """
                
        #         self.cursor.execute(query, values)
        #         self.conn.commit()

        #     return item

    # def process_item(self, item, spider):
    #     try:
    #         # Construct the SQL query. Only include columns where a value is present in the item.
    #         columns = ['name', 'original_url', 'shop_id']  # These are required
    #         values = [item['name'], item['original_url'], item['shop_id']]

    #         # Add other columns only if their values are not None
    #         if item.get('description') is not None:
    #             columns.append('description')
    #             values.append(item['description'])
    #         if item.get('price') is not None:
    #             columns.append('price')
    #             values.append(item['price'])
    #         if item.get('brand') is not None:
    #             columns.append('brand')
    #             values.append(item['brand'])
    #         if item.get('material') is not None:
    #             columns.append('material')
    #             values.append(item['material'])
    #         if item.get('color') is not None:
    #             columns.append('color')
    #             values.append(item['color'])
    #         if item.get('dimension') is not None:
    #             columns.append('dimension')
    #             values.append(item['dimension'])
    #         if item.get('weight') is not None:
    #             columns.append('weight')
    #             values.append(item['weight'])
    #         if item.get('stock_quantity') is not None:
    #             columns.append('stock_quantity')
    #             values.append(item['stock_quantity'])
    #         if item.get('rating') is not None:
    #             columns.append('rating')
    #             values.append(item['rating'])

    #         placeholders = ', '.join(['%s'] * len(columns)) #Create correct number of place holders
    #         columns_sql = ', '.join(columns) #Create names that will be on table
    #         self.cursor.execute("SELECT id FROM products WHERE original_url = %s AND shop_id = %s", 
    #           (item['original_url'], item['shop_id']))
    #         if self.cursor.fetchone():
    #             # Обновить существующую запись
    #             self.cursor.execute("UPDATE products SET ... WHERE original_url = %s AND shop_id = %s", 
    #                 (item['original_url'], item['shop_id']))
    #         else:
    #             self.cursor.execute("INSERT INTO products ({columns_sql}) VALUES ({placeholders})", ...)
    #         #     query = f"""
    #         #         INSERT INTO products ({columns_sql})
    #         #         VALUES ({placeholders})
    #         #         ON CONFLICT (original_url) DO NOTHING;
    #         #     """
    #         # self.cursor.execute(query, values)
    #         self.conn.commit()

    #         return item

        # except psycopg2.Error as e:
        #     self.conn.rollback()
        #     spider.logger.error(f"Database error: {e} with item: {item}")
        #     return item  # Return the item so that it isn't lost
