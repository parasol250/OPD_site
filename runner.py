from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from furniture.spiders.dynamic_spider import DynamicSpider

def run_spider():
    process = CrawlerProcess(get_project_settings())
    process.crawl(DynamicSpider)
    process.start()

if __name__ == "__main__":
    run_spider()