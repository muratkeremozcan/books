// class design in ES6
import $ from '$';

// Parent class
class Widget {
  constructor(width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  }
  render($where) {
    if (this.$elem) {
      this.$elem.css({
        width: this.width + 'px',
        height: this.height + 'px'
      }).appendTo($where);
    }
  }
}

// child class
class Button extends Widget {
  constructor(width, height, label) {
    // super call
    super(width, height);

    this.label = label || "Default";
    this.$elem = $("<button>").text(this.label);
  }
  // override inherited render
  render($where) {
    // super call
    super($where);
    this.$elem.click(this.onClick.bind(this));
  }
  onClick(evt) {
    console.log("Button '" + this.label + "' clicked!");
  }
}

// Despite syntactic improvements, these are not real classes, as they still operate on top of the [[Prototype]] mechanism.
// the end result is the same as OLOO style

////

$(document).ready(function () {
  var $body = $(document.body);
  var btn1 = new Button(125, 30, "Hello");
  var btn2 = new Button(150, 40, "World");

  btn1.render($body);
  btn2.render($body);
});

