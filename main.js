// in) lace_target_string : setup target element string in jquery. (ex. 'body')
// in) result_size        : result SVG area size in pixels. (ex. 240)
function lace_ctor
( lace_target_string
, result_size
, default_char
, default_rotation
, default_shift_x
, default_shift_y
, default_shift_division
)
{
  var result_half = result_size >> 1
  
  this.lace_target = $(lace_target_string)
  this.is_running = false

  this.change = function()
  {
    var char     = this.ui_input_char.val()
    var shift_x  = Number(this.ui_input_shift_x.val())
    var shift_y  = Number(this.ui_input_shift_y.val())
    var division = Number(this.ui_input_division.val())
    
    var ui_output_result = document.getElementById('ui_output_result');
    
    while(ui_output_result.childNodes.length > 0)
      ui_output_result.removeChild(ui_output_result.firstChild)
    
    var svg_text_generator = function(x, y, rotation_angle, id)
    {
      var svg_text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      svg_text.setAttribute('id', id)
      svg_text.setAttribute('x', x)
      svg_text.setAttribute('y', y)
      svg_text.setAttribute('font-size', result_half)
      svg_text.setAttribute('transform', 'rotate(' + rotation_angle + ')')
      var svg_node = document.createTextNode(char)
      svg_text.appendChild(svg_node)
      ui_output_result.appendChild(svg_text)
    }
    
    var svg_text_size_detector = function()
    {
      var test_id = 'ui_output_result_test';
      svg_text_generator(0, 0, 0, test_id)
      
      var test_element = document.getElementById(test_id)
      
      var bounding_box = test_element.getBBox()
      this.ui_output_result.removeChild(test_element)
      return { width: bounding_box.width, height: bounding_box.height }
    }
    
    var svg_text_size = svg_text_size_detector()
    var svg_text_x = shift_x -(svg_text_size.width >> 1)
    var svg_text_y = - shift_y
    
    for(var n = division; n; --n)
      svg_text_generator(svg_text_x, svg_text_y, n * 360 / division, 'ui_output_result_char_' + n)
    
  }
  
  this.initialize = function()
  {
    this.generate_ui_input()
    this.generate_ui_output()
  }

  this.generate_ui_input = function()
  {
    this.ui_input = $('<article id="ui_input"></article>')
    this.lace_target.append(this.ui_input)
    
    var appends =
    [ $('<h1>input parameters:</h1>')
    , $('<label for="ui_input_char">character (able to multiple characters): </label>')
    , this.ui_input_char     = $('<input id="ui_input_char" value="' + default_char + '" size="1"></input>')
    , $('<label for="ui_input_shift_x">shift x [px]: </label>')
    , this.ui_input_shift_x  = $('<input id="ui_input_shift_x" type="number" value="' + default_shift_x + '" step="1"></input>')
    , $('<label for="ui_input_shift_y">shift y [px]: </label>')
    , this.ui_input_shift_y  = $('<input id="ui_input_shift_y" type="number" value="' + default_shift_y + '" step="1"></input>')
    , $('<label for="ui_input_division">division [#] (>=1): </label>')
    , this.ui_input_division = $('<input id="ui_input_division" type="number" value="' + default_shift_division + '" min="1"></input>')
    ]
    
    var delegate_ctor = function(){}
    delegate_ctor.prototype =
    { invoke: function(){ this.master.change() }
    , master: this
    }
    
    for(var key in appends)
    {
      this.ui_input.append(appends[key])
      appends[key].change(function(){ (new delegate_ctor).invoke() });
    }
  }

  this.generate_ui_output = function()
  {
    this.ui_output = $('<article id="ui_output"></article>')
    this.lace_target.append(this.ui_output)
    
    var appends =
    [ $('<h1>result (real-time show):</h1>')
    , this.ui_output_result = $('<svg id="ui_output_result" width="' + result_size + '" height="' + result_size + '" viewBox="-' + result_half + ' -' + result_half + ' ' + result_size + ' ' + result_size + '"></svg>')
    ]
    
    for(var key in appends)
      this.ui_output.append(appends[key])
  }
  
  this.initialize()
  this.change()
}
