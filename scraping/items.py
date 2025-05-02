import scrapy
from scrapy.item import Item, Field

class FurnitureItem(scrapy.Item):
    name = scrapy.Field()
    description = scrapy.Field()
    price = scrapy.Field()
    original_url = scrapy.Field()
    image = scrapy.Field()
    store = scrapy.Field()
    link = scrapy.Field()
    category = scrapy.Field()
    brand = scrapy.Field()
    material = scrapy.Field()
    color = scrapy.Field()
    dimension = scrapy.Field()
    weight = scrapy.Field()
    stock_quantity = scrapy.Field()
    rating = scrapy.Field()
    # name = scrapy.Field()
    # description = scrapy.Field()
    # price = scrapy.Field()
    # original_url = scrapy.Field()
    # shop_id = scrapy.Field()
    # brand = scrapy.Field()
    # material = scrapy.Field()
    # color = scrapy.Field()
    # dimension = scrapy.Field()
    # weight = scrapy.Field()
    # stock_quantity = scrapy.Field()
    # rating = scrapy.Field()
    # created_at = Field() # Removed. Will be handled by DB default
    # updated_at = Field() # Removed. Will be handled by DB default

    def __repr__(self):
        return f"FurnitureItem(name={self['name']}, price={self['price']}, original_url={self['original_url']})"