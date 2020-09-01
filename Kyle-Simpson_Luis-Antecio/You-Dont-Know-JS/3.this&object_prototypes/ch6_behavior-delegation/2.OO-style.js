// OO versus OLOO

// OO style

// Parent class Foo is inherited by child class Bar, which is then instantiated

// define Foo
function Foo(who) {
  this.me = who;  
}
Foo.prototype.identify = function() {
  return 'I am ' + this.me;
};

// define Bar
// invoke Foo, in the context of Bar with who parameter
function Bar(who) {
  Foo.call(this, who);
}
  // Object.create(..) creates a “new” object out of thin air, and links that new object’s internal [[Prototype]] to the object you specify
Bar.prototype = Object.create(Foo.prototype);
Bar.prototype.speak = function() {
  console.log('Hello ' + this.identify() + '.');
};

// instantiate b1 and b2
var b1 = new Bar('b1'); //?
var b2 = new Bar('b2'); //?

b1.speak();
b2.speak();
