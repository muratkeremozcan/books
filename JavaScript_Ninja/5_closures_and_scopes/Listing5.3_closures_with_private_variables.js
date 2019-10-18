var assert = require('assert');

function Ninja() { // constructor
  var feints = 0; // PRIVATE VARIABLE: the scope of this var is inside the constructor function
  this.getFeints = function() { // ACCESSOR METHOD: READ-ONLY ACCESS to var feints, outside functions can only access feints with this method
    return feints;
  };
  this.feint = function() { // feint incrementor: outside functions can only increment feint with this function
    feints++;
  };
}

var ninja1 = new Ninja(); // instantiate a ninja
ninja1.feint(); // call the feint method to increment feints

assert(ninja1.feints === undefined, 'error: could access private variable'); // cannot access feints private variable
console.log(ninja1.feints); // undefined, can't access private variable
assert(ninja1.getFeints() === 1, 'error: could not access private variable via accessor method'); // can ONLY access private var with this method
console.log(ninja1.getFeints()); // 1 : can access private var via get method

var ninja2 = new Ninja(); // instantiate a ninja
assert(ninja2.getFeints() === 0, 'error: could not access private variable via accessor method'); // another instance has its own private variable
ninja2.feint();
ninja2.feint();
ninja2.feint();
console.log(ninja2.feints); // undefined, can't access private var
console.log(ninja2.getFeints());
