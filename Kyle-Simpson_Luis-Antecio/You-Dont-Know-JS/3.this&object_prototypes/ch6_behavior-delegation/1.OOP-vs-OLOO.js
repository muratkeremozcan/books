// OOP way
function Foo() {
}
  
var a1 = new Foo();

Foo.prototype.constructor = function Gotcha(){};

a1.constructor //?
a1.constructor.name //?
a1 //?



// OLOO way
var Foob = {};

var a2 = Object.create(Foob);

Object.defineProperty(Foob, 'constructor', {
  enumerable: false,
  value: function Gotchaz(){}
});

a2.constructor //?
a2.constructor.name //?
a2 //?