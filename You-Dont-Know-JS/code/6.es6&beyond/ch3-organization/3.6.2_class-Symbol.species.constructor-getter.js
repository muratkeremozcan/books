// One place where static can be useful is in setting the Symbol.species getter (known internally in the specification as @@ species) for a derived (child) class. 
// This capability allows a child class to signal to a parent class what constructor should be used when not intending the child class's constructor itself



class MyCoolArray extends Array {
  // force 'species' to be parent constructor
  static get [Symbol.species]() {
    return Array;
  }
}

// For example If you define a derived class from Array, but you want those methods to continue to vend actual Array instances instead of from your derived class
var a = new MyCoolArray(1, 2, 3);
var b = a.map(function(v) {
  return v*2;
});

b instanceof MyCoolArray; //?
b instanceof Array; //?


/////////////////

// Mirror: a parent class method can use a child’s species declaration
class Foo {
  // defer 'species' to be derived constructor
  static get [Symbol.species]() {
    return this;
  }
  spawn() {
    return new this.constructor[Symbol.species]();
  }
}

class Bar extends Foo {
  // force 'species' to be parent constructor
  static get [Symbol.species]() {
    return Foo;
  }
}

var aa = new Foo(); //?
var bb = aa.spawn(); //?
bb instanceof Foo; //?

var x = new Bar();
var y = x.spawn(); //?
y instanceof Bar; //?
y instanceof Foo; //?