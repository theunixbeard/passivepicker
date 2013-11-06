var GenericScraper = require('./GenericScraper.js').GenericScraper;

// Digikey Specific GenericScraper

var DigikeyScraper = function() {
  // Superclass constructor. 1st arg specifys context, i.e. US not the superclass
  //GenericScraper.call(this, arg1, arg2); 

  // Override whatever we want from GenericScraper
}

// This allows Digikey Scraper to subclass GenericScraper
DigikeyScraper.prototype = new GenericScraper();

// Functions
// (If not declared in constructor, need to create on prototype)
//DigikeyScraper.prototype.fnName = function(arg1, arg2) { }