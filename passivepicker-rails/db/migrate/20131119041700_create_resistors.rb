class CreateResistors < ActiveRecord::Migration
  def change
    create_table :resistors do |t|
      t.string :vendor_part_number
      t.string :manufacturer_part_number
      t.decimal :resistance
      t.integer :power_rating
      t.decimal :tolerance
      t.string :footprint
      t.decimal :price
      t.integer :minimum_quantity

      t.timestamps
    end
  end
end
