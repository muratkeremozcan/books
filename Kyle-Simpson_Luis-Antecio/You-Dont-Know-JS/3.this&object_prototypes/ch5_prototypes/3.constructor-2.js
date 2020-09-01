// TL,DR; don't do this, use Object.create or new keyword so that your created object has constructor property on it

// the .constructor property on Foo.prototype is only there by default on the object created when Foo the function is declared. 
// If you create a newer object and by doing so replace a function’s default .prototype object reference, 
  // the new object will not by default magically get a .constructor on it.

function Foo() { /* .. */ }


Foo.prototype = { /* .. */ }; // create a new prototype object
// toggle to see the difference
// Foo.prototype.constructor === Foo; //?

// to 'fix' Foo.prototype to have a constructor, you would have to manually add the constructor property to it
// Object.defineProperty( Foo.prototype, 'constructor', {
//   enumerable: false,
//   writable: true,
//   configurable: true,
//   value: Foo // point constructor at 'Foo'
// })

var a1 = new Foo(); //?
a1.constructor === Foo; //?
a1.constructor === Object; //?

// a1 has no .constructor property, so it delegates up the [[Prototype]] chain to Foo.prototype. 
// But that object doesn’t have a .constructor either (like the default Foo.prototype object would have had!), 
// so it keeps delegating, this time up to Object.prototype, the top of the delegation chain. 
// That object indeed has a .constructor on it, which points to the built-in Object(..) function.


