// TL,DR; creating new objects that are prototype linked , using new is ok, using Object.create is ok, using Object.setPrototypeOf is better suited for Kyle's OLOO style
// __proto__ is super useful
// in contrast, if you want to avoid prototype linking, use Object.assign

function Foo(name) {
  this.name = name;
}
// Foo.prototype.myName adds a property (function) to the Foo.prototype object.
Foo.prototype.myName = function() {
  return this.name;
};


function Bar(name,label) {
  // invoke Foo, in the context of Bar, and pass in name
  Foo.call( this, name );
  this.label = label;
}


// Bar.prototype = Foo.prototype;
// this makes Bar.prototype another reference to Foo.prototype, which effectively links Bar directly to the same object to which Foo links: Foo.prototype. 
// this means when you start assigning, like Bar.prototype.myLabel = ..., you’re modifying not a separate object but the shared Foo.prototype object itself!

// Bar.prototype = new Foo();
// this does in fact create a new object that is duly linked to Foo.prototype as we’d want. 
// But, it used the Foo(..) “constructor call” to do it. If that function has any side effects, those side effects happen at the time of this linking


// When function Bar() { .. } is declared, Bar, like any other function, has a .prototype link to its default object.
// Same as var bar = {}  which is another way to create an object 
// But that object is not linked to Foo.prototype like we want. We want to create a new object that is linked as we want,
// Object.create(..) creates a “new” object out of thin air, and links that new object’s internal [[Prototype]] to the object you specify

// here, we make a new `Bar.prototype` linked to `Foo.prototype`
// Bar.prototype = Object.create( Foo.prototype ); // Pre-ES6: throws away existing Bar.prototype, makes a new one
Object.setPrototypeOf(Bar.prototype, Foo.prototype); // ES6: modifies the existing Bar.prototype


// Bar.prototype myLabel adds a property to the Bar.prototype object
Bar.prototype.myLabel = function() {
  return this.label;
};

var a = new Bar( "a", "obj a" );
a.myName(); //?
a.myLabel(); //?


var b = new Foo('a');
b.myName(); //?
// b.myLabel(); // does not work

// the question 'instanceof' answers is in the entire [[Prototype]] chain of a, does the object arbitrarily pointed to by Foo.prototype ever appear?
a instanceof Bar; //?
a instanceof Foo; //?
b instanceof Bar; //?
b instanceof Foo; //?

// The question isPrototypeOf(..) answers is: in the entire [[Prototype]] chain of a, does Foo.prototype ever appear?
Bar.prototype.isPrototypeOf(a); //?
Foo.prototype.isPrototypeOf(b); //?
Bar.prototype.isPrototypeOf(b); //?

// We can also directly retrieve the [[Prototype]] of an object. As of ES5, the standard way to do this is:
Object.getPrototypeOf(a); //?
Object.getPrototypeOf(b); //?

// The strange .__proto__ (not standardized until ES6!) property “magically” retrieves the internal [[Prototype]] of an object as a reference, 
  // which is quite helpful if you want to directly inspect (or even traverse: .__proto__.__proto__...) the chain.
a.__proto__//?
b.__proto__//?
// __proto__ exists on the built-in Object.prototype, along with the other common utilities (.toString(), .isPrototypeOf(..), etc.).
// .__proto__ looks like a property, but it’s actually more appropriate to think of it as a getter/setter
// we can use .__proto__ to chain up!
a.__proto__.__proto__//?
