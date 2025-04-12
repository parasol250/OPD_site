ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE SET NULL;  -- Если категория удалена, у товара category_id=NULL

ALTER TABLE products
ADD CONSTRAINT fk_products_shop
FOREIGN KEY (shop_id) REFERENCES shops(id)
ON DELETE SET NULL;  -- Если магазин удален, у товара shop_id=NULL

ALTER TABLE favorites
ADD CONSTRAINT fk_favorites_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE favorites
ADD CONSTRAINT fk_favorites_product
FOREIGN KEY (product_id) REFERENCES products(id)
ON DELETE CASCADE;

ALTER TABLE data_sources
ADD CONSTRAINT fk_data_sources_shop
FOREIGN KEY (shop_id) REFERENCES shops(id)
ON DELETE CASCADE;

ALTER TABLE scrape_logs
ADD CONSTRAINT fk_scrape_logs_source
FOREIGN KEY (source_id) REFERENCES data_sources(id)
ON DELETE SET NULL;