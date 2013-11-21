namespace :import_mongo do

  def connect_to_mongo
    include Mongo

    host = ENV['MONGO_RUBY_DRIVER_HOST'] || 'localhost'
    port = ENV['MONGO_RUBY_DRIVER_PORT'] || MongoClient::DEFAULT_PORT

    puts "Connecting to #{host}:#{port}"
    db = MongoClient.new(host, port).db('test')
    return db
  end

  desc "TODO"
  task all: [:environment, :resistors, :capacitors] do
    puts 'All passives imported!'
  end

  desc "TODO"
  task resistors: :environment do

  end

  desc "TODO"
  task capacitors: :environment do
    db = connect_to_mongo
    # Deal with capacitors
    capacitors = db.collection('digikeycapacitorsscrapy')
    puts "There are #{capacitors.count()} records in the test collection. Here they are:"
    capacitors.find().limit(5).each do |doc| 
      #puts doc.inspect
      capacitor = Capacitor.new
      # deal with string fields
      capacitor.vendor_part_number = doc['digikeyPartNumber']
      capacitor.manufacturer_part_number = doc['manufacturerPartNumber']
      capacitor.footprint = doc['packageCase']



=begin
     t.string   "vendor_part_number"
    t.string   "manufacturer_part_number"
    t.decimal  "capacitance"
    t.integer  "voltage_rating"
    t.decimal  "tolerance"
    t.string   "footprint"
    t.decimal  "price"
    t.integer  "minimum_quantity"   
=end
    end
  end

end
