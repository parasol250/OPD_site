import scrapy
from scrapy.item import Item, Field

class FurnitureItem(Item):
    name = Field()
    description = Field()
    price = Field()
    original_url = Field()
    category_id = Field()
    shop_id = Field()
    brand = Field()
    material = Field()
    color = Field()
    dimension = Field()
    weight = Field()
    stock_quantity = Field()
    rating = Field()
    image_urls = scrapy.Field()  # URL изображений для загрузки
    images = scrapy.Field()      # Информация о скачанных изображениях
    image_paths = scrapy.Field() # Пути к сохраненным изображениям
    # created_at = Field() # Removed. Will be handled by DB default
    # updated_at = Field() # Removed. Will be handled by DB default

    def __repr__(self):
        return f"FurnitureItem(name={self['name']}, price={self['price']}, original_url={self['original_url']})"