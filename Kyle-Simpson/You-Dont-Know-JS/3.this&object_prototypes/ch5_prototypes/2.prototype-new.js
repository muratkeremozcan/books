function Foo() {
  //
}
// all functions by default get a public, non-enumerable (see Chapter 3) property on them called prototype,
Foo.prototype; //?

// each object created by calling 'new Foo()' will end up (somewhat arbitrarily) [[Prototype]]-linked to this “Foo dot prototype” object.
  // Object.create() does not seem to be any different
var a = new Foo();
a//?
// : When a is created by calling new Foo(), one of the things that happens is that 
  // a gets an internal [[Prototype]] link to the object that Foo.prototype is pointing at
Object.getPrototypeOf(a) === Foo.prototype //?
// therefore calling new is similar to using Object.create

// In class-oriented languages, multiple copies (aka instances) of a class can be made, like stamping something out from a mold.
// But in JavaScript, there are no such copy actions performed. You don’t create multiple instances of a class. 
  //You can create multiple objects that are [[Prototype]]-linked to a common object.
  // Object.assign begs to differ