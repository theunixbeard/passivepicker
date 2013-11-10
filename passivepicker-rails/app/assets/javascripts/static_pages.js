
$(function() {
  initPage();
});

$(window).bind('page:change', function() {
  initPage();
});

function initPage() {
  console.log("Hi friend, I hope you like the website! You can reach me at thatsgoodsoftware@gmail.com if you have any feedback!");
  $(".addCapacitor").on("click", addRowToCategory);
  $(".addResistor").on("click", addRowToCategory);
}

var capacitorRow = [''
  ,'<div class="row collapse">'
    ,'<div class="large-2 columns">'
      ,'<input type="text" placeholder="Quantity, ex. &quot;3&quot;">'
    ,'</div>'
    ,'<div class="large-4 columns">'
      ,'<input type="text" placeholder="Capacitance, ex. &quot;15pF&quot; or &quot;0.1uF&quot;">'
    ,'</div>'
    ,'<div class="large-6 columns">'
      ,'<a href="javascript:void(0);" class="button postfix addCapacitor">Add Capacitor</a>'
    ,'</div>'    
  ,'</div>'
  ].join('');
var resistorRow = [''
  ,'<div class="row collapse">'
    ,'<div class="large-2 columns">'
      ,'<input type="text" placeholder="Quantity, ex. &quot;7&quot;">'
    ,'</div>'
    ,'<div class="large-4 columns">'
      ,'<input type="text" placeholder="Resistance, ex. &quot;10M&quot; or &quot;5K&quot; or &quot;470&quot;">'
    ,'</div>'
    ,'<div class="large-6 columns">'
      ,'<a href="javascript:void(0);" class="button postfix addResistor">Add Resistor</a>'
    ,'</div>'     
  ,'</div>'
  ].join('');

// TODO: Add validation of row BEFORE we add the next row
function addRowToCategory(jqEvent) {
  var success = false;
  
  // Hide any error advice

  if($(jqEvent.currentTarget).hasClass("addCapacitor")) {
    // Check if valid capacitor
    $('#capacitorFieldset').append(capacitorRow);
    $(".addCapacitor").on("click", addRowToCategory);
  } else if($(jqEvent.currentTarget).hasClass("addResistor")){
    // Check if valid resistor
    $('#resistorFieldset').append(resistorRow);
    $(".addResistor").on("click", addRowToCategory);
  }
  if(success) {
    $(jqEvent.currentTarget).hide();
  } else {
    // Show error advice
  }

}