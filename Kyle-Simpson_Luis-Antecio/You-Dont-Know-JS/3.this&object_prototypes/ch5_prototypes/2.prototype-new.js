function Foo() {
  this.bar = 123;
}
// all functions by default get a public, non-enumerable property on them called prototype
Foo.prototype; //?
// the prototype property has a method called constructor, pointing back to the function
Foo.prototype.constructor; //?

// each object created by calling 'new Foo()' will end up [[Prototype]]-linked to Foo.prototype.
// and 'this' will point to the newly created object
var a = new Foo();
a//?
a.bar; //?
a.__proto__; //?
// calling new on a function also assigns the prototype of the function to the .__proto__ of the newly created object 
a.__proto__ === Foo.prototype; //?

// in other words: When a is created by calling new Foo(), one of the things that happens is that 
// a gets an internal [[Prototype]] link to the object that Foo.prototype is pointing at
Object.getPrototypeOf(a) === Foo.prototype //?

// therefore calling new is similar to using Object.create

// In class-oriented languages, multiple copies (aka instances) of a class can be made, like stamping something out from a mold.
// But in JavaScript, there are no such copy actions performed. You don’t create multiple instances of a class. 
  // You can create multiple objects that are [[Prototype]]-linked to a common object.

//////////

// significance of a.__proto__ === Foo.prototype;
// it allows you to add member functions to a child class and inherit others from the base class
function Animal(){}
Animal.prototype.walk = function() {
  console.log('walk');
};

function Bird() {}
Bird.prototype.__proto__ = Animal.prototype;

Bird.prototype.fly = function() {
  console.log('fly');
}

var bird = new Bird();
bird.__proto__  === Bird.prototype; //?
bird.__proto__.__proto__  === Animal.prototype; //?

// walk gets looked up from bird.__proto__.__proto__.walk
bird.walk();
// fly gets looked up from bird.__proto__
bird.fly();