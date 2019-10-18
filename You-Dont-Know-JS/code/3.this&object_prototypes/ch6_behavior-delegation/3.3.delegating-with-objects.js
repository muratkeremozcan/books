// delegating with objects : OLOO
import $ from '$';

var Widget = {
  init: function (width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  },
  insert: function ($where) {
    if (this.$elem) {
      this.$elem.css({
        width: this.width + "px",
        height: this.height + "px"
      }).appendTo($where);
    }
  }
};
// Object.create(..) creates a “new” object out of thin air, and links that new object’s internal [[Prototype]] to the object you specify
var Button = Object.create(Widget);

Button.setup = function (width, height, label) {
  // delegated call
  this.init(width, height);
  this.label = label || "Default";

  this.$elem = $("<button>").text(this.label);
};
Button.build = function ($where) {
  // delegated call
  this.insert($where);
  this.$elem.click(this.onClick.bind(this));
};
Button.onClick = function (evt) {
  console.log("Button '" + this.label + "' clicked!");
};

// With this OLOO-style approach, we don’t think of Widget as a parent and Button as a child.
// Rather, Widget is just an object and is sort of a utility collection that any specific type of widget might want to delegate to,
// and Button is also just a standalone object

// we didn’t share the same method name render(..) in both objects, the way classes suggest,
// but instead we chose different names (insert(..) and build(..)) that were more descriptive of what task each does specifically.
// The initialization methods are called init(..) and setup(..), respectively, for the same reasons.


/////

$( document ).ready( function(){
  var $body = $( document.body );

  // With class constructors, you are forced (not really, but it is strongly suggested) to do both construction and initialization in the same step.
  // OLOO better supports the principle of separation of concerns, \
  // where creation and initialization are not necessarily conflated into the same operation.
  var btn1 = Object.create( Button );
  btn1.setup( 125, 30, "Hello" );

  var btn2 = Object.create( Button );
  btn2.setup( 150, 40, "World" );

  btn1.build( $body );
  btn2.build( $body );
} );
