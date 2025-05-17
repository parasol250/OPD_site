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
    image_urls = scrapy.Field()  # url изображений для загрузки
    images = scrapy.Field()      # информация о скачанных изображениях
    image_paths = scrapy.Field() # пути к сохраненным изображениям

    def __repr__(self):
        return f"FurnitureItem(name={self['name']}, price={self['price']}, original_url={self['original_url']})"