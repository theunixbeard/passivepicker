# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field

class DigikeyCapacitorItem(Item):

  digikeyPartNumber = Field() # Important for ordering
  manufacturerPartNumber = Field() # Important for comparing vendors
  manufacturer = Field()
  quantity = Field() # Important to make sure not sold out
  price = Field() # Important for selection
  minimumQuantity = Field() # Important for selection algo
  packaging = Field() 
  series = Field()
  capacitance = Field() # Important
  voltageRating = Field() # Important, somewhat, for selection algo
  tolerance = Field() # May use to filter
  temperatureCoefficient = Field()
  mountingType = Field()
  operatingTemperature = Field()
  applications = Field()
  ratings = Field()
  packageCase = Field() # Important, its the size (needs to be parsed)
  sizeDimension = Field()
  height = Field()   
  thickness = Field()
  leadSpacing = Field()
  features = Field()
  failureRate = Field()