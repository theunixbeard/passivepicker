from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

from digikeyCapacitor.items import DigikeyCapacitorItem

from scrapy import log
from scrapy.http import Request
import re

class DigikeyCapacitorSpider(BaseSpider):
  base_url = "http://www.digikey.com/product-search/en/capacitors/ceramic-capacitors/131083?pageSize=500"
  name = "digikeyCapacitor"
  start_urls = [base_url]

  def __init__(self, category=None, *args, **kwargs):
    super(DigikeyCapacitorSpider, self).__init__(*args, **kwargs)
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
    capacitors = hxs.select("//table[@id='productTable']/tbody/tr")
    for capacitor in capacitors:
      item = DigikeyCapacitorItem()
      item['digikeyPartNumber'] = self.xpathClassSelector(capacitor, ' digikey-partnumber ', '/a/text()') # same, did it
      item['manufacturerPartNumber'] = self.xpathClassSelector(capacitor, ' mfg-partnumber ', '/a/span/text()') # same, did it
      item['manufacturer'] = self.xpathClassSelector(capacitor, ' vendor ', '/span/a/span/text()') # same, did it
      item['quantity'] = self.xpathClassSelector(capacitor, ' qtyAvailable ', '/text()') # same, did it
      item['price'] = self.xpathClassSelector(capacitor, ' unitprice ', '/a/text()') # same, did it
      item['minimumQuantity'] = self.xpathClassSelector(capacitor, ' minQty ', '/text()') # same, did it
      item['packaging'] = self.xpathClassSelector(capacitor, ' packaging ', '/text()[position()=1]') # same, did it
      item['series'] = self.xpathClassSelector(capacitor, ' series ', '/a/text()') # same, did it
      item['capacitance'] = self.xpathClassSelector(capacitor, ' CLS 13 ', '/text()')
      item['voltageRating'] = self.xpathClassSelector(capacitor, ' CLS 14 ', '/text()')
      item['tolerance'] = self.xpathClassSelector(capacitor, ' CLS 3 ', '/text()') 
      item['temperatureCoefficient'] = self.xpathClassSelector(capacitor, ' CLS 17 ', '/text()')
      item['mountingType'] = self.xpathClassSelector(capacitor, ' CLS 69 ', '/text()')
      item['operatingTemperature'] = self.xpathClassSelector(capacitor, ' CLS 252 ', '/text()')
      item['applications'] = self.xpathClassSelector(capacitor, ' CLS 405 ', '/text()')
      item['ratings'] = self.xpathClassSelector(capacitor, ' CLS 707 ', '/text()')
      item['packageCase'] = self.xpathClassSelector(capacitor, ' CLS 16 ', '/text()')
      item['sizeDimension'] = self.xpathClassSelector(capacitor, ' CLS 46 ', '/text()')
      item['height'] = self.xpathClassSelector(capacitor, ' CLS 1,500 ', '/text()')
      item['thickness'] = self.xpathClassSelector(capacitor, ' CLS 1,501 ', '/text()')
      item['leadSpacing'] = self.xpathClassSelector(capacitor, ' CLS 508 ', '/text()')
      item['features'] = self.xpathClassSelector(capacitor, ' CLS 5 ', '/text()')
      item['failureRate'] = self.xpathClassSelector(capacitor, ' CLS 1,531 ', '/center/text()')      
      items.append(item)
    # Now determine next request to make
    if self.current_page <= self.last_page:
      items.append(Request(url= self.base_url + "&page=" + str(self.current_page), callback= self.parse))
    return items

    # hxs.select("//table[@id='productTable']/tbody/tr/td[contains(concat(' ', normalize-space(@class), ' '), ' CLS 1 ')]")[0].extract()