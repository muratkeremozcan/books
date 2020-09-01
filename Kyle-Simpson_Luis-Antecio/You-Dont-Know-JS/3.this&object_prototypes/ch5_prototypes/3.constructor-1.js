function Foo() {
  //
}
// The Foo.prototype object gets a public, non-enumerable property called .constructor,
  // and this property is a reference back to the function (Foo in this case) that the object is associated with.
Foo.prototype.constructor === Foo; //?

// Moreover, we see that object a created by the “constructor” call new Foo() seems to also have a property on it called .constructor,
  // the .constructor reference is delegated up to Foo.prototype
var a = new Foo();
a.constructor === Foo; //?

a; //?

// in JavaScript, it’s most appropriate to say that a “constructor” is any function called with the new keyword in front of it.
// functions are not constructors, but function calls are constructor calls, if 'new' is used


//////////

function Foob(name) {
  this.name = name;
}

// Foo.prototype.myName adds a property (function) to the Foo.prototype object. Now, a.myName() works, but perhaps surprisingly. How?
Foob.prototype.myName = function() {
  return this.name;
}

var a = new Foob('a');
var b = new Foob('b');

// a and b each end up with an internal [[Prototype]] linkage to Foob.prototype:
  // When myName is not found on a or b, it’s instead found (through delegation) on Foo.prototype.
a.name //?
a.myName() //?
b.name //?
b.myName(); //?

