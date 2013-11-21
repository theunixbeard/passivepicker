require './lib/MongoPuller.rb'

mongo_puller = MongoPuller.new db_name: 'test', 
                              collection_name: 'digikeycapacitorsscrapy'
                              
=begin                    
mongo_puller.pull_data fields: ['voltageRating'],
                      output_file_name: './lib/testdata/digikeyVoltageRating.txt'

mongo_puller.pull_data fields: ['capacitance'],
                      output_file_name: './lib/testdata/digikeyCapacitance.txt'

mongo_puller.pull_data fields: ['packageCase', 'mountingType'],
                      output_file_name: './lib/testdata/digikeyPackageCase.txt'
=end
mongo_puller.pull_data fields: ['tolerance'],
                      output_file_name: './lib/testdata/digikeyTolerance.txt'

mongo_puller.pull_data fields: ['minimumQuantity'],
                      output_file_name: './lib/testdata/digikeyMinimumQuantity.txt'

mongo_puller.pull_data fields: ['price'],
                      output_file_name: './lib/testdata/digikeyPrice.txt'