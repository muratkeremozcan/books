// new.target is a new “magical” value available in all functions, though in normal functions it will always be undefined.
// In any constructor, new.target always points at the constructor that new actually invoked
// If new.target is undefined, you know the function was not called with new

class Foo {
  constructor() {
    console.log('Foo: ', new.target.name);
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log('Bar: ', new.target.name);
  }
  baz() {
    console.log('Baz: ', new.target);
  }
}

var a = new Foo();
var b = new Bar(); // the call site is Bar, so you see that Foo: Bar thanks to super()
b.baz(); // baz() function is not the 'new' target because it's not the constructor