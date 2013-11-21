require 'rubygems'
require 'mongo'


class MongoPuller
include Mongo

  #db_name and collection_name
  def initialize args
    host = ENV['MONGO_RUBY_DRIVER_HOST'] || 'localhost'
    port = ENV['MONGO_RUBY_DRIVER_PORT'] || MongoClient::DEFAULT_PORT
    @db = MongoClient.new(host, port).db(args[:db_name])
    @collection = @db.collection(args[:collection_name])
  end

  # fields and output_file_name
  # fields is array. First element is 'key', other elements are values
  def pull_data args
    already_seen = {}
    File.open args[:output_file_name], 'w' do |f|
      key = args[:fields].shift
      @collection.find().each do |doc|
        primary_field = doc[key]
        already_seen[primary_field] = args[:fields].map { |f| doc[f] }
      end
      already_seen.keys.sort.each do |key|
        f.puts key
        already_seen[key].each do |v|
          f.puts v
        end
      end
    end
  end

end