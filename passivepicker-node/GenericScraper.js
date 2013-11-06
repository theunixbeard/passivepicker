

/*
Generic Scraper Class


Key Design Decisions:
  1. Mongo dependency? (yeah thats probably OK)
  2. 

Design:
  Requires:
    cheerio // For scraping HTML manipulation
    request // for making web requests
    fs
    winston
    mongoose
    sleep
    _

  Data:
    [konstants]
    kDebug // Uses local HTML file rather than web reqs, logs to console instead of file 
    kCurrentDate // Used as part of the log file name
    kLogFileName // Path to log dir + log name
    kScrapeBaseURL // First page to visit, to get page count for example
    kHeaders // To fake out the site
    kPageDelayTime // To avoid getting banned
    kModelToCSSMapping // Used to map between our names and theirs ** Do we want reverse? 
    // kCSSToModelMapping?
    [other]
    currentPageNum // what page we are currently scraping
    lastPageNum // last page in URL sequence to scrape
    model // Model to use for storage
    db // Specific mongoose.connection, used for .once and .on
    Schema // Specific mongoose.schema, used to create specific schemas 

  Control Flow:
  // After DB etc. is setup, start requests the "first" page.
  // In the simple case, it calls a function to get a page count which then initiates
  // the scraping. In the distributed case, start is told a start and end page and so
  // it just directly 
  start
  //These two call each other in turn
  processPage($, pageNumber)
  requestURL(URL, functionToCall) // where functionToCall is processPage

  Other Functions:
    [Expect override, not implemented in base]
    urlForPage(page) // Modify baseURL for specific page
*/


// Exports
module.exports.GenericScraper = GenericScraper;

// Class Constructor
var GenericScraper = function() {
  //this.prop = "value";
  //this.funcProp = function() {}; // Or just assign an actual function
}

// Functions
// (If not declared in constructor, need to create on prototype)
//GenericScraper.prototype.fnName = function(arg1, arg2) { }