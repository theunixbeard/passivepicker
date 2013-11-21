class Capacitor < ActiveRecord::Base

  validates :vendor_part_number, presence: true,
                                        uniqueness: { case_sensitive: false }
  validates :manufacturer_part_number, presence: true
  validates :capacitance, presence: true
  validates :voltage_rating, presence: true
  validates :tolerance, presence: true
  validates :footprint, presence: true
  validates :price, presence: true
  validates :minimum_quantity, presence: true  

  def analyze_footprint footprint, mounting_type
    # We expect a string formatted as follows XXXX a_bunch_of_crap where each X is a digit
    # Hence, if we have 4 digits then a space, grab that and chuck the rest
    # UNLESS mounting_type is "Through Hole", then we check if it is 'Radial', 'Radial, Disc' or 'Axial'
    if mounting_type == 'Through Hole'
      good_footprints = ['Radial', 'Radial, Disc', 'Axial']
      if good_footprints.contains footprint
        return 'Through Hole'
      else
        return nil
      end
    else
      /(\d\d\d\d) .*/.match(footprint) do |m|
        return m[1]
      end
      return nil
    end
  end

  def analyze_voltage_rating voltage_rating
    /(\d+\.?\d*).*/.match(voltage_rating) do |m|
      return BigDecimal.new(m[1])
    end
    return nil
  end

  def analyze_capacitance capacitance
    /(\d+\.?\d*)([puµ]F)/.match(capacitance) do |m|
      capacitance_value = BigDecimal.new(m[1])
      if m[2] == 'uF' || m[2] == 'μF' || m[2] == 'µF'
        capacitance_value *= 10**(-6)
      elsif m[2] == 'pF'
        capacitance_value *= 10**(-12)
      else
        return nil
      end
      return capacitance_value
    end
    return nil
  end

  # Need capacitance to convert absolute tolerances to percentage based
  #capacitance passed in should be in BigDecimal form
  def analyze_tolerance tolerance, capacitance
    #of form '-20%, +80%' (if 2 matches) or '±2.5%' (if 1 match)
    tolerance_percentage = BigDecimal.new(0)
    matched = false
    tolerance.scan(/(\d+\.?\d*)%/) do |match|
      matched = true
      new_percentage = BigDecimal.new(match[0])
      if new_percentage > tolerance_percentage
        tolerance_percentage = new_percentage
      end
    end
    if matched
      return (tolerance_percentage / 100)
    end
    #of form '±0.05pF', need to do percentage based math with capacitance
    absolute = analyze_capacitance tolerance
    if absolute
      return (absolute / capacitance)
    end
    return nil
  end

  def analyze_price price
    price.gsub! ',', ''
    /(\d+\.?\d*)/.match(price) do |m|
      return BigDecimal.new(m[1])
    end
    return nil
  end

  def analyze_minimum_quantity minimum_quantity
    actual_minimum_quantity = nil
    minimum_quantity.map { |i| i.gsub! ',', '' }
    minimum_quantity.each do |q|
      /(\d+)/.match(q) do |m|
        actual_minimum_quantity = m[1].to_i
      end
      /Non-Stock/.match(q) do |m|
        # Don't include in non-stock
        return nil
      end
    end
    return actual_minimum_quantity
  end
end
