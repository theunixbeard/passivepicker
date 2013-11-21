require 'spec_helper'
require 'helpers/capacitor_model_helper'

describe Capacitor do
  before do 
    @capacitor = Capacitor.new()
    @mongo_capactior = create_mongo_capacitor
  end

  subject { @capacitor }

  it { should respond_to(:vendor_part_number) }
  it { should respond_to(:manufacturer_part_number) }
  it { should respond_to(:capacitance) } 
  it { should respond_to(:voltage_rating) }
  it { should respond_to(:tolerance) }
  it { should respond_to(:footprint) }
  it { should respond_to(:price) }
  it { should respond_to(:minimum_quantity) } 

  it "parses correct footprints" do
    expect(@capacitor.analyze_footprint '0402 (1005 Metric)', 'Surface Mount, MLCC').to eq('0402')
    expect(@capacitor.analyze_footprint '0603 (1608 Metric) Wide (Long Side), 0306 (0816 Metric)', 'Surface Mount, MLCC').to eq('0603')
  end

  it "parses the correct voltage rating" do
    expect(@capacitor.analyze_voltage_rating '11000V (11kV)').to eq(11000)
    expect(@capacitor.analyze_voltage_rating '6.3V').to eq(6.3)
    expect(@capacitor.analyze_voltage_rating '-').to eq(nil)
  end

  it "parses the correct capacitance" do
    expect(@capacitor.analyze_capacitance  '10000pF').to eq(BigDecimal.new('1e-8'))
    expect(@capacitor.analyze_capacitance '1.9pF').to eq(BigDecimal.new('1.9e-12'))
    expect(@capacitor.analyze_capacitance '7.0pF').to eq(BigDecimal.new('7e-12'))
    expect(@capacitor.analyze_capacitance '75pF').to eq(BigDecimal.new('7.5e-11'))
    expect(@capacitor.analyze_capacitance '0.10pF').to eq(BigDecimal.new('1e-13'))
    expect(@capacitor.analyze_capacitance '0.011µF').to eq(BigDecimal.new('1.1e-8'))
  end

  it "parses the correct price" do
    expect(@capacitor.analyze_price  '0.99984').to eq(BigDecimal.new('0.99984'))
    expect(@capacitor.analyze_price  '1,006.09000').to eq(BigDecimal.new('1006.09000'))
    expect(@capacitor.analyze_price  '0.00151').to eq(BigDecimal.new('0.00151'))
    expect(@capacitor.analyze_price  '109.60640').to eq(BigDecimal.new('109.60640'))
    expect(@capacitor.analyze_price  'Calculate').to eq(nil)
    expect(@capacitor.analyze_price  'Call').to eq(nil)
  end

  it "parses the correct tolerance" do
    capacitance = BigDecimal.new('1.9e-12')
    expect(@capacitor.analyze_tolerance  '-20%, +80%', capacitance).to eq(BigDecimal.new('0.8'))
    expect(@capacitor.analyze_tolerance  '0%, +100%', capacitance).to eq(BigDecimal.new('1'))
    expect(@capacitor.analyze_tolerance  '±0.05pF', capacitance).to be_close(BigDecimal.new('0.0263'), BigDecimal.new('0.001'))
    expect(@capacitor.analyze_tolerance  '±1%', capacitance).to eq(BigDecimal.new('0.01'))
    expect(@capacitor.analyze_tolerance  '±2.5%', capacitance).to eq(BigDecimal.new('0.025'))
    expect(@capacitor.analyze_tolerance  '-', capacitance).to eq(nil)
  end

  it "parses the correct minimum quantity" do
    expect(@capacitor.analyze_minimum_quantity(["10,000", "Non-Stock", " ", " \n" ])).to eq(nil)
        expect(@capacitor.analyze_minimum_quantity(["10,000", " ", " \n" ])).to eq(10000)
  end

end
