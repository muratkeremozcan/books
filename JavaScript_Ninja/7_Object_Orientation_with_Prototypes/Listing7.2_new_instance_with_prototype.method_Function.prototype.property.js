var assert = require('assert');

// every function has a prototype object that is set as the prototype of the of the objects created with that function
function Ninja() {
  // initially the prototype object only has a constructor property
  // then we add a new property
  Ninja.prototype.swingSword = function () { // every function has a PROTOTYPE object we can modify
    return true;
  };
}

const ninja1 = Ninja(); // calls the function as a function, nothing happens
assert (ninja1 === undefined);

const ninja2 = new Ninja(); // calls the function as a constructor, a new object instance is created and it includes the method from the prototype of the function
console.log(ninja2.swingSword);
assert (ninja2 && ninja2.swingSword && ninja2.swingSword());