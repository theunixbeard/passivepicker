from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

from tutorial.items import DigikeyResistorItem

from scrapy import log
from scrapy.http import Request
import re

class DigikeyResistorSpider(BaseSpider):
  base_url = "http://www.digikey.com/product-search/en/resistors/chip-resistor-surface-mount/65769?pageSize=500"
  name = "digikeyResistor"
  start_urls = [base_url]

  def __init__(self, category=None, *args, **kwargs):
    super(DigikeyResistorSpider, self).__init__(*args, **kwargs)
    self.last_page = -1
    self.current_page = 1

  def xpathClassSelector(self, xpath, xpathClass, furtherSelection):
    xpathClassSelectorStart = "td[contains(concat(' ', normalize-space(@class), ' '), '"
    xpathClassSelectorEnd = "')]"
    toReturn = xpath.select(xpathClassSelectorStart + xpathClass + xpathClassSelectorEnd + furtherSelection).extract()
    return toReturn

  def parse(self, response):
    self.current_page += 1
    hxs = HtmlXPathSelector(response)
    # Establish last page in crawl
    if self.last_page == -1:
      # in jquery Number($('a.Last').attr("href").match(/page\/([0-9]+)/)[1]);
      link_text = hxs.select("//a[contains(concat(' ', normalize-space(@class), ' '), ' Last ')][position()=1]/@href").extract()[0]
      self.last_page = int(re.sub(r'.*/', '', link_text))
    items = []
    # First get all data values
    resistors = hxs.select("//table[@id='productTable']/tbody/tr")
    for resistor in resistors:
      item = DigikeyResistorItem()
      item['digikeyPartNumber'] = self.xpathClassSelector(resistor, ' digikey-partnumber ', '/a/text()')
      item['manufacturerPartNumber'] = self.xpathClassSelector(resistor, ' mfg-partnumber ', '/a/span/text()')
      item['manufacturer'] = self.xpathClassSelector(resistor, ' vendor ', '/span/a/span/text()')
      item['quantity'] = self.xpathClassSelector(resistor, ' qtyAvailable ', '/text()')
      item['price'] = self.xpathClassSelector(resistor, ' unitprice ', '/a/text()') 
      item['minimumQuantity'] = self.xpathClassSelector(resistor, ' minQty ', '/text()') 
      item['packaging'] = self.xpathClassSelector(resistor, ' packaging ', '/text()[position()=1]') 
      item['series'] = self.xpathClassSelector(resistor, ' series ', '/a/text()')
      item['resistance'] = self.xpathClassSelector(resistor, ' CLS 1 ', '/text()')
      item['tolerance'] = self.xpathClassSelector(resistor, ' CLS 3 ', '/text()') 
      item['power'] = self.xpathClassSelector(resistor, ' CLS 2 ', '/text()')
      item['composition'] = self.xpathClassSelector(resistor, ' CLS 174 ', '/text()')
      item['features'] = self.xpathClassSelector(resistor, ' CLS 5 ', '/text()')
      item['temperatureCoefficient'] = self.xpathClassSelector(resistor, ' CLS 17 ', '/text()')
      item['packageCase'] = self.xpathClassSelector(resistor, ' CLS 16 ', '/text()')
      item['supplierDevicePackage'] = self.xpathClassSelector(resistor, ' CLS 1,291 ', '/text()')
      item['sizeDimension'] = self.xpathClassSelector(resistor, ' CLS 46 ', '/text()')
      item['height'] = self.xpathClassSelector(resistor, ' CLS 329 ', '/text()')
      item['numberOfTerminations'] = self.xpathClassSelector(resistor, ' CLS 1,127 ', '/text()')
      item['failureRate'] = self.xpathClassSelector(resistor, ' CLS 1,531 ', '/center/text()')
      items.append(item)
    # Now determine next request to make
    if self.current_page <= self.last_page:
      items.append(Request(url= self.base_url + "&page=" + str(self.current_page), callback= self.parse))
    return items

    # hxs.select("//table[@id='productTable']/tbody/tr/td[contains(concat(' ', normalize-space(@class), ' '), ' CLS 1 ')]")[0].extract()