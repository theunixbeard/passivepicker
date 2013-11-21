FactoryGirl.define do

=begin
  factory :capacitor do
    vendor_part_number "495-1920-1-ND"
    manufacturer_part_number "B37933K5000B760"
    capacitance
    voltage_rating
    tolerance
    footprint
    price
    minimum_quantity
  end

  factory :mongo_capacitor, class: Hash do

  end
=end
end