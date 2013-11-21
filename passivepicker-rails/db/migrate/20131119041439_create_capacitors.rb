class CreateCapacitors < ActiveRecord::Migration
  def change
    create_table :capacitors do |t|
      t.string :vendor_part_number
      t.string :manufacturer_part_number
      t.decimal :capacitance
      t.decimal :voltage_rating
      t.decimal :tolerance
      t.string :footprint
      t.decimal :price
      t.integer :minimum_quantity

      t.timestamps
    end
  end
end
