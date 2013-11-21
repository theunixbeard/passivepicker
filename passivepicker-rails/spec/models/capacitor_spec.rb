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
  end

  it "parses the correct capacitance" do
    expect(@capacitor.analyze_capacitance  '10000pF').to eq(BigDecimal.new('1e-8'))
    expect(@capacitor.analyze_capacitance '1.9pF').to eq(BigDecimal.new('1.9e-12'))
    expect(@capacitor.analyze_capacitance '7.0pF').to eq(BigDecimal.new('7e-12'))
    expect(@capacitor.analyze_capacitance '75pF').to eq(BigDecimal.new('7.5e-11'))
    expect(@capacitor.analyze_capacitance '0.10pF').to eq(BigDecimal.new('1e-13'))
    expect(@capacitor.analyze_capacitance '0.011µF').to eq(BigDecimal.new('1.1e-8'))
  end

end
