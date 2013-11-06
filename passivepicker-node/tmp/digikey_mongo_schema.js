var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  var digikeyResistorSchema = mongoose.Schema({
      digikeyPartNumber: String, // Important for ordering
      manufacturerPartNumber: String, // Important for comparing vendors
      manufacturer: String,
      quantity: String, // Important to make sure not sold out
      price: String, // Important for selection
      minimumQuantity: String, // Important for selection algo
      packaging: String, 
      series: String,
      resistance: String, // Important
      tolerance: String, // May use to filter
      power: String, // Important, somewhat, for selection algo
      composition: String,
      features: String,
      temperatureCoefficient: String,
      packageCase: String,
      supplierDevicePackage: String,
      sizeDimension: String,
      height: String,
      numberOfTerminations: String,
      failureRate: String
  });
  digikeyResistorSchema.methods.gimmeResistance = function () {
    return this.resistance;
  };
  digikeyResistorSchema.methods.matchsCriteria = function (
      countNeeded, resistance, footprint, voltage) {
    console.log('Implement this!');
  };
  var DigikeyResistor = mongoose.model('DigikeyResistor', digikeyResistorSchema);
  
  // Example creating resistor
  var fluffy = new DigikeyResistor({ 
      digikeyPartNumber: 'part#555',
      manufacturerPartNumber: 'mpn#gangsta'
  });
  debugger;
  fluffy.save(function (err, fluffy) {
    if (err){
      console.log(err);
    }
    console.log("woo, saved it");
    // Example querying resistor
    DigikeyResistor.find(function (err, resistors) {
      if (err){} // TODO handle err
      console.log(resistors);
      db.close();
    })
  });
});
