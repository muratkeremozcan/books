var assert = require('assert');
// the purpose of a constructor is to cause new objects to be created and initialized (instantiated)
function Ninja() { // a constructor that creates a skulk property on whatever object it's invoked on
  this.skulk = function() { // a property named skulk is added to the object, which makes skulk a method
    return this;
  };
}
// ES6 version
class NinjaES2015 {
  constructor() { // in ES6 you specifically indicate that the function is a constructor function
    this.skulk = function () {
      return this;
    };
  }
}
// new instances invoked by Ninja() constructor
// there is nothing special about a constructor function. The only difference is how it is invoked with the NEW keyword
// when calling a function with keyword NEW, a new empty object is created and set as THIS: the constructor function's context
var ninja1 = new Ninja();
var ninja2 = new Ninja();
var ninja3 = new NinjaES2015();

assert(ninja1.skulk() === ninja1, 'ninja1 instance is not this');
assert(ninja2.skulk() === ninja2, 'ninja2 instance is not this');
assert(ninja3.skulk() === ninja3, 'ninja3 instance is not this');