// “class” design in classic-style pure JS without any “class” helper library or syntax:
import $ from '$';

// Parent class
function Widget(width, height) {
  this.width = width || 50;
  this.height = height || 50;
  this.$elem = null;
}
Widget.prototype.render = function ($where) {
  if (this.$elem) {
    this.$elem.css({
      width: this.width + 'px',
      height: this.height + 'px'
    }).appendTo($where);
  }
};

// child class
function Button(width, height, label) {
  // 'super' constructor call
  Widget.call(this, width, height);

  this.label = label || 'Default';
  this.$elem = $('<button>').text(this.label);
}
// Button inherits from Widget
Button.prototype = Object.create(Widget.prototype);

// override inherited render()
Button.prototype.render = function ($where) {
  // super call
  Widget.prototype.render.call(this, $where);
  this.$elem.click(this.onClick.bind(this));
};
// create new onClick handler
Button.prototype.onClick = function (evt) {
  console.log('Button ' + this.label + ' clicked');
};

// OO design patterns tell us to declare a base render(..) in the parent class, then override it in our child class, 
  // not to replace it per se, but rather to augment the base functionality with button-specific behavior.

/////


$(document).ready(function () {
  var $body = $(document.body);
  var btn1 = new Button(125, 30, "Hello");
  var btn2 = new Button(150, 40, "World");

  btn1.render($body);
  btn2.render($body);
});
