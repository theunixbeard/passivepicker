// Digikey Resistor Mongoose Model

// Assume DB has been opened

module.exports.makeModel = makeModel;

// Create and return model on given mongoose connection
function makeModel(Schema, mongoose) {
  var digikeyResistorSchema = Schema({
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
  digikeyResistorSchema.index({ "digikeyPartNumber" : 1 },
                              { unique: true, dropDups: true });
  // PERFORM OTHER INDEX BUILDING HERE! 
  
  digikeyResistorSchema.methods.matchsCriteria = function (
      countNeeded, resistance, footprint, voltage) {
    console.log('Implement this!');
  };
  var DigikeyResistor = mongoose.connection.model(
                          'DigikeyResistor', digikeyResistorSchema);
   return DigikeyResistor;
}
