import scrapy
from scrapy.item import Item, Field

class FurnitureItem(Item):
    name = Field()
    description = Field()
    price = Field()
    original_url = Field()
    shop_id = Field()
    brand = Field()
    material = Field()
    color = Field()
    dimension = Field()
    weight = Field()
    stock_quantity = Field()
    rating = Field()
    # created_at = Field() # Removed. Will be handled by DB default
    # updated_at = Field() # Removed. Will be handled by DB default

    def __repr__(self):
        return f"FurnitureItem(name={self['name']}, price={self['price']}, original_url={self['original_url']})"