# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field

class DigikeyResistorTHItem(Item):

  digikeyPartNumber = Field() # Important for ordering
  manufacturerPartNumber = Field() # Important for comparing vendors
  manufacturer = Field()
  quantity = Field() # Important to make sure not sold out
  price = Field() # Important for selection
  minimumQuantity = Field() # Important for selection algo
  packaging = Field() 
  series = Field()
  resistance = Field() # Important
  tolerance = Field() # May use to filter
  power = Field() # Important, somewhat, for selection algo
  composition = Field()
  features = Field()
  temperatureCoefficient = Field()
  packageCase = Field()
  supplierDevicePackage = Field()
  sizeDimension = Field()
  height = Field()
  numberOfTerminations = Field()
  failureRate = Field()
