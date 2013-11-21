require 'spec_helper'

describe Resistor do
  before { @resistor = Resistor.new() }

  subject { @resistor }

  it { should respond_to(:vendor_part_number) }
  it { should respond_to(:manufacturer_part_number) }
  it { should respond_to(:resistance) } 
  it { should respond_to(:power_rating) }
  it { should respond_to(:tolerance) }
  it { should respond_to(:footprint) }
  it { should respond_to(:price) }
  it { should respond_to(:minimum_quantity) } 
end
