// BIGGEST FRUSTRATION with JS is implicit binding 
// implicit binding is lost when assigning a function to a variable or passing it as an argument to a function!! Left Hand Side / LHS assignment
// the binding falls back to the default binding: the call site, usually the global object or undefined if strict mode

// There are 3 ways to address the loss of implicit this binding 


{ // problem: here age is 1 with regular function, 
  // because implicit binding of 'this' is lost to the call site (setTimeout in this case) when function gets assigned
  function Person(age) {
    this.age = age;
    this.growOld = function () {
      this.age++;
      // WTF? call site is setTimeout, so 'this' got set to setTimeout
      this; //?
    }
  }
  let person = new Person(1);
  setTimeout(person.growOld, 1000);
  setTimeout(function () {
    person.age; //?
  }, 2000)
}

{ // (1) arrow functions have lexical scope; they capture the reference to 'this' as function scope itself, call site don't matter
  function Person(age) {
    this.age = age;
    this.growOld = () => {
      this.age++;
      this; //?
    }
  }
  let person = new Person(1);
  setTimeout(person.growOld, 1000);
  setTimeout(function () {
    person.age; //?
  }, 2000)
}


{ // (2) pre ES6, we could set the scope of 'this' with var self = this . self is in the scope of the function, so no problems.
  function Person(age) {
    this.age = age;
    var self = this;
    this.growOld = function () {
      self.age++;
      self; //?
      // 'this' is setTimeout, but we don't care, we are using 'self' - which are gonna be the spawned Person instances
      this; //?
    }
  }
  let person = new Person(1);
  setTimeout(person.growOld, 1000); //?
  setTimeout(function () {
    person.age; //?
  }, 2000)
}

{ // (3) another way of ensuring function cope used to be with using bind(this)
  // function() {..}.bind(this)  sets the reference to 'this' as the surrounding scope instead of the call site
  function Person(age) {
    this.age = age;
    this.growOld = function () {
      this.age++;
    }.bind(this);
  }
  let person = new Person(1);
  setTimeout(person.growOld, 1000); //?
  setTimeout(function () {
    person.age; //?
  }, 2000)
}


///////////
// side note on arrows

// 1: can't use super keyword when you try to override the function in a child class
// have to make a copy of the parent function and override it in
class Adder {
  constructor(public a: number) { }
  // This function is now safe to pass around
  add = (b: number): number => {
    return this.a + b;
  }
}

class ExtendedAdder extends Adder {
  // Create a copy of parent before creating our own
  private superAdd = this.add;
  // Now create our override
  add = (b: number): number => {
    return this.superAdd(b);
  }
}

// 2: sometimes you need a function that just returns a simple object literal.
// WRONG WAY TO DO IT
var foo = () => {
  bar: 123
};
// won't work
// foo().bar; //?

// Correct 🌹
var foo = () => ({
  bar: 123
});
foo().bar; //?

