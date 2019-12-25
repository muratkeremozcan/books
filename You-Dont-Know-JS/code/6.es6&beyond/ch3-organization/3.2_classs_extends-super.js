// super and extends are used for [[ Prototype]] delegation link between two function prototypes — commonly mislabeled “inheritance” or confusingly labeled “prototype inheritance” —
// there is no super equivalent pre ES6, without hacky trade offs 


class Foo { 
  constructor(a, b) {
    this.x = a;//?
    this.y = b;//?
  }
  gimmeXY() {
    return this.x * this.y; //?
  }
}

// Bar extends Foo means to link the [[ Prototype]] of Bar.prototype to Foo.prototype
class Bar extends Foo {
  constructor(a, b, c) {
    // In the constructor, super automatically refers to the “parent constructor”: super means Foo when used in the Bar constructor.
    super(a, b); //?
    this.z = c; //?
  }
  gimmeXYZ() {
    //  In a method, super refers to the “parent object,” such that you can then make a property/ method access off it
    // super in a method like gimmeXYZ() specifically means Foo.prototype
    return super.gimmeXY() * this.z; //?
  }
}

let b = new Bar(5, 15, 25); 
b.x; //?
b.y; //?
b.z; //?
b.gimmeXYZ(); //?
b.gimmeXY(); //?



// NOTE
// Constructors are not required for classes or subclasses; a default constructor is substituted in both cases if omitted. So long as 'this' isn't used or not returning from derived constructor, this works
// However, the default substituted constructor is different for a direct class versus an extended class. 
// Specifically, the default subclass constructor automatically calls the parent constructor, and passes along any arguments.
// constructor(... args) { 
//   super(... args);
// }
// in a constructor of a subclass, you cannot access this until super(..) has been called
// this is because the parent constructor is actually the one creating/ initializing your instance’s this.

