require './lib/MongoPuller.rb'

mongo_puller = MongoPuller.new db_name: 'test', 
                              collection_name: 'digikeycapacitorsscrapy'
                              
                              
# First field determines sort order, subsequent fields will be included below
mongo_puller.pull_data fields: ['voltageRating'],
                      output_file_name: './lib/testdata/digikeyVoltageRating.txt'

# First field determines sort order, subsequent fields will be included below
mongo_puller.pull_data fields: ['capacitance'],
                      output_file_name: './lib/testdata/digikeyCapacitance.txt'

# First field determines sort order, subsequent fields will be included below
mongo_puller.pull_data fields: ['packageCase', 'mountingType'],
                      output_file_name: './lib/testdata/digikeyPackageCase.txt'