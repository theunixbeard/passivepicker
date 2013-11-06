var cheerio = require('cheerio'),
  request = require('request'),
  fs = require('fs'),
  winston = require('winston'),
  mongoose = require('mongoose'),
  sleep = require('sleep'),
  _ = require('underscore');

/*
  Algorithm:
  1. Visit Base URL
  2. Get page number of last page
  3. Loop over each page, with delay of 30 seconds
  4. Grab all data on each page and put in database

  Detailed program structure:
  1. Setup constants, DB, mongoose
  2. Call start() entry point
  3. Fetch first page to see how many pages we need
  4. Repeatedly call processRegularPage() for each page until completed
*/

// Constants
var debug = 1;
var databaseName = 'mongodb://localhost/test';
var currentDate = new Date();
var logFileName = 'log/' + currentDate.toISOString().replace(/T.*/, '');
var DIGIKEY_RESISTOR_BASE_URL = 'http://www.digikey.com/product-search/en/resistors/chip-resistor-surface-mount/65769?pageSize=500';
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type' : 'application/x-www-form-urlencoded' 
};
var PAGE_DELAY_TIME = 30;

var modelToCSSMapping = {
  digikeyPartNumber: ['digikey-partnumber'], // we want text of child anchor tag <a>textWeWant</a>
  manufacturerPartNumber: ['mfg-partnumber'], // we want text of child anchor (which in turn is inside a span tag...) <a><span>textWeWant</span></a>
  manufacturer: ['vendor'], // <span><a><span>textWeWant</span></a></span>
  quantity: ['qtyAvailable'], //directly in td, BUT need to parse out the number? (ex. 50,000 - Immediate) also has a pesky <br> in it!!!
  price: ['unitprice'], // <a>textWeWant</a>
  minimumQuantity: ['minQty'], // direct, easy <td>textWeWant</td>
  packaging: ['packaging'], // <td>textWeWant <a></a><br><a></a></td> Bunch of extra crap in it!
  series: ['series'], // <td><a>textWeWant</a></td>
  resistance: ['CLS', '1'], //<td>textWeWant</td> (But two classes???)
  tolerance: ['CLS', '3'], //<td>textWeWant</td>
  power: ['CLS', '2'], //directly in td
  composition: ['CLS', '174'], //directly in td
  features: ['CLS', '5'], //directly in td
  temperatureCoefficient: ['CLS', '17'], //directly in td
  packageCase: ['CLS', '16'], //directly in td
  supplierDevicePackage: ['CLS', '1,291'], //directly in td
  sizeDimension: ['CLS', '46'], //directly in td
  height: ['CLS', '329'], //directly in td
  numberOfTerminations: ['CLS', '1,127'], //directly in td
  failureRate: ['CLS', '1,531'], //<td><center>textWeWant</center></td>
};

// Models
var DigikeyResistor;
// Global data
var currentPage = 1;
var lastPageNum;


// Setup logger
if(debug != 1) {
  winston.add(winston.transports.File, { filename: logFileName });
  winston.remove(winston.transports.Console);
}

// Setup MongoDB and call start() function
mongoose.connect(databaseName);
var db = mongoose.connection;
var Schema;
db.on('error', function(err) {
  winston.error('connection error: ' + err);
});
db.once('open', function() {
  Schema = mongoose.Schema;
  DigikeyResistor = 
    require('./models/digikey_resistor.js').makeModel(Schema, mongoose);
  // Start program!
  start();
});

// Given an HTML page, pull out the relevant data and store in the database
function processRegularPage($) {
  winston.info('process page ' + currentPage + ' of ' + lastPageNum);
  // Table we want has id='productTable'
  // Iterate over each <tr> child of productTable
  // 
  $('#productTable tbody tr').each(function() {
    var currentResistor = new DigikeyResistor();
    //winston.info($(this).html());
    $(this).children('td').each(function() {
      //winston.log($(this).html());
      applyValueToResistor($(this), currentResistor);
    });
    // Insert record into mongoDB    
    //sleep.sleep(PAGE_DELAY_TIME*100); // to debug 1 row at a time
    //debugger;
    //winston.info('About to Save: ' + currentResistor['digikeyPartNumber']);
    currentResistor.save(function (err, currentResistor) {
      debugger;
      if (err){
        debugger;
        // Don't care about duplicate key errors, they are expected on rescrape
        if(err.stack.indexOf('duplicate key error') == -1){ 
          winston.error(err);
        }
      } else {
        winston.info('Saved: ' + currentResistor['digikeyPartNumber']);
      }
    });
  });
  winston.info('Finished page ' + currentPage + ' of ' + lastPageNum);
  var nextPage = ++currentPage;
  winston.info('Sleeping for: ' + PAGE_DELAY_TIME);
  sleep.sleep(PAGE_DELAY_TIME);
  winston.info('Wokeup, on to page: ' + nextPage);
  // Stop Once we are on the last page
  if(nextPage <= lastPageNum) {
    requestURL(DIGIKEY_RESISTOR_BASE_URL + '&page=' + nextPage, processRegularPage);    
  }
}

// Given the HTML of the resistor index page, process it
function establishPageCountAndStart($) {
  // Digikey resistor start page now loaded
  lastPageNum = Number($('a.Last').attr("href").match(/page\/([0-9]+)/)[1]);
  if (isNaN(lastPageNum)) {
    winston.error('Couldnt determine last page number');
    process.exit(1);
  }
    requestURL(DIGIKEY_RESISTOR_BASE_URL + '&page=1', processRegularPage);
}

function start() {
  requestURL(DIGIKEY_RESISTOR_BASE_URL, establishPageCountAndStart);
}

function requestURL(url, callback, debugURL) {
  if (debug == 1) {
    if (typeof debugURL === "undefined") {
      debugURL = '/Users/primary/programming/business/passivepicker/test_data/page.html';
    }
    fs.readFile(debugURL, function(err, data) {
      if(err) throw err;
      $ = cheerio.load(data);
      callback($);
    });
  } else {
    request({ url: DIGIKEY_RESISTOR_BASE_URL, headers: headers }, 
            function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var $;
        $ = cheerio.load(body);
        callback($);
      }
    });
  }

}

function applyValueToResistor($, currentResistor) {
  // $ represents constents of the <td>
  // THUS DOESNT HAVE CLASS??!?!?!?!?
  Object.keys(modelToCSSMapping).forEach(function(element, index, array) {
    match = true;
    modelToCSSMapping[element].forEach(function(el, ind, arr) {
      if (!$.hasClass(el)) {
        match = false;
      }
    });
    if(match) {
        //winston.info($.attr("class") + ": " + modelToCSSMapping[element]);
        var nodeValue = extractDataFromTableDataNode($, element);
        //winston.info(element + " " + nodeValue);
        currentResistor[element] = nodeValue;
    }
  });
}

function extractDataFromTableDataNode($, element) {
  // GAHHHHHH APPARENTLY ALL I NEED TO DO IS RETURN THE TEXT...
  // $ is <td> with correct class
  var toReturn = "";
  toReturn = $.text();
  /* <td>textWeWant</td>
    minimumQuantity, resistance, tolerance, power, composition,
    features, temperatureCoefficient, packageCase, supplierDevicePackage,
    sizeDimension, height, numberOfTerminations
  */
  /*
  BELOW LINE IS WRONG SINCE -1 EVALUATES TO TRUE ANYWAY!!!!
  var tdDataMap = ['minimumQuantity', 'resistance', 'tolerance', 'power',
    'compositon', 'features', 'temperatureCoefficient', 'packageCase',
    'supplierDevicePackage', 'sizeDimension', 'height',
    'numberOfTerminations'];
  if (tdDataMap.indexOf(element)) {
    toReturn = tdData($, element);
  }*/
  /* <td>textWeWantAndExtraCrap</td> (may need individual algos)
     quantity, packaging, failureRate
  */

  /* <td><a>textWeWant</a></td>
    digikeyPartNumber, price, series
  */

  /* <td><a><span>textWeWant</span></a></td>
    manufacturerPartNumber
  */

  /* <td><span><a><span>textWeWant</span></a></span></td>
    manufacturer
  */
  return toReturn;
}

function tdAnchorData($, element) {
  var toReturn = "";
  // Seems no different... Can just return text
  toReturn = $.text();
  return toReturn;
}

function tdData($, element) {
  var toReturn = "";  
  toReturn = $.text();
  return toReturn;
}
