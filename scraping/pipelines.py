import psycopg2

class FurniturePipeline:
    def __init__(self):
        self.db_host = "localhost"
        self.db_name = "furniture_aggregator"  # Replace
        self.db_user = "postgres"  # Replace
        self.db_password = "0000"  # Replace
        self.conn = None

    def open_spider(self, spider):
        try:
            self.conn = psycopg2.connect(
                host=self.db_host,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password,
                client_encoding='utf8'
            )
            self.cursor = self.conn.cursor()
        except psycopg2.Error as e:
            spider.logger.error(f"Database connection error: {e}")
            raise

    def close_spider(self, spider):
        if self.conn:
            self.cursor.close()
            self.conn.close()

    def process_item(self, item, spider):
        try:

            # Проверяем, существует ли уже товар с такой ссылкой
            self.cursor.execute(
                "SELECT id FROM products WHERE link = %s",
                (item['link'],))
            product_exists = self.cursor.fetchone()

            if product_exists:
                # Обновляем существующий товар
                self.cursor.execute(
                    """
                    UPDATE products 
                    SET 
                        name = %s,
                        description = %s,
                        price = %s,
                        image = %s,
                        brand = %s,
                        material = %s,
                        color = %s,
                        dimensions = %s,
                        weight = %s,
                        stock_quantity = %s,
                        rating = %s,
                        updated_at = NOW()
                    WHERE link = %s
                    """,
                    (
                        item['name'],
                        item['description'],
                        item['price'],
                        item['image'],
                        item['brand'],
                        item['material'],
                        item['color'],
                        item['dimension'],
                        item['weight'],
                        item['stock_quantity'],
                        item['rating'],
                        existing[0]
                    )
                )
            
            else:
                # Вставляем новый товар
                self.cursor.execute(
                    """
                    INSERT INTO products (
                        name, description, price, original_url, 
                        image, store, link, category,
                        brand, material, color, dimensions,
                        weight, stock_quantity, rating, created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s, NOW(), NOW()
                    )
                """, (
                    item['name'],
                    item['description'],
                    item['price'],
                    item['link'],
                    item['image'],
                    item['store'],
                    item['link'],
                    item['category'],
                    item['brand'],
                    item['material'],
                    item['color'],
                    item['dimension'],
                    item['weight'],
                    item['stock_quantity'],
                    item['rating']
                    
                ))
            
            self.conn.commit()
        except Exception as e:
            spider.logger.error(f"Error saving item to DB: {e}")
            self.conn.rollback()
            raise
            # Construct the SQL query. Only include columns where a value is present in the item.
            # columns = ['name', 'original_url', 'shop_id']  # These are required
            # values = [item['name'], item['original_url'], item['shop_id']]

            # # Add other columns only if their values are not None
            # if item.get('description') is not None:
            #     columns.append('description')
            #     values.append(item['description'])
            # if item.get('price') is not None:
            #     columns.append('price')
            #     values.append(item['price'])
            # if item.get('brand') is not None:
            #     columns.append('brand')
            #     values.append(item['brand'])
            # if item.get('material') is not None:
            #     columns.append('material')
            #     values.append(item['material'])
            # if item.get('color') is not None:
            #     columns.append('color')
            #     values.append(item['color'])
            # if item.get('dimension') is not None:
            #     columns.append('dimension')
            #     values.append(item['dimension'])
            # if item.get('weight') is not None:
            #     columns.append('weight')
            #     values.append(item['weight'])
            # if item.get('stock_quantity') is not None:
            #     columns.append('stock_quantity')
            #     values.append(item['stock_quantity'])
            # if item.get('rating') is not None:
            #     columns.append('rating')
            #     values.append(item['rating'])

            # placeholders = ', '.join(['%s'] * len(columns)) #Create correct number of place holders
            # columns_sql = ', '.join(columns) #Create names that will be on table
            # query = f"""
            #     INSERT INTO products ({columns_sql})
            #     VALUES ({placeholders})
            #     ON CONFLICT (original_url) DO NOTHING;
            # """
            # self.cursor.execute(query, values)
            # self.conn.commit()

        return item

        # except psycopg2.Error as e:
        #     self.conn.rollback()
        #     spider.logger.error(f"Database error: {e} with item: {item}")
        #     return item  # Return the item so that it isn't lost