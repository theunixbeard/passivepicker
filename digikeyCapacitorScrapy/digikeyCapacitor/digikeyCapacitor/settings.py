# Scrapy settings for tutorial project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'digikeyCapacitor'

SPIDER_MODULES = ['digikeyCapacitor.spiders']
NEWSPIDER_MODULE = 'digikeyCapacitor.spiders'


# scrapy-mongodb config
ITEM_PIPELINES = [
  'scrapy_mongodb.MongoDBPipeline',
]

MONGODB_URI = 'mongodb://localhost:27017'
MONGODB_DATABASE = 'test'
MONGODB_COLLECTION = 'digikeycapacitorsscrapy'
MONGODB_UNIQUE_KEY = 'digikeyPartNumber'
MONGODB_ADD_TIMESTAMP = True

# FOR TESTING CACHE HTTP
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 0 # Set to 0 to never expire

# For Delay between requests
DOWNLOAD_DELAY = 30 # 1 == 1 second
