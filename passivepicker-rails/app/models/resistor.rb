class Resistor < ActiveRecord::Base

  validates :vendor_part_number, presence: true,
                                        uniqueness: { case_sensitive: false }
  validates :manufacturer_part_number, presence: true
  validates :resisttance, presence: true
  validates :power_rating, presence: true
  validates :tolerance, presence: true
  validates :footprint, presence: true
  validates :price, presence: true
  validates :minimum_quantity, presence: true 

end
