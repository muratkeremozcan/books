var assert = require('assert');

function Ninja() { // constructor . Capital first letter indicates constructor or 'class'
  var feints = 0; // PRIVATE VARIABLE: the scope of this var inside the constructor function
  this.getFeints = function() { // ACCESSOR METHOD: READ-ONLY ACCESS to var feints, outside functions can only access feints with this method
    return feints;
  };
  this.feint = function() { // feint incrementor: outside functions can only increment feint with this function
    feints++;
  };
}

var ninja1 = new Ninja(); // instantiate a ninja
ninja1.feint(); // call the feint method to increment feints

// NEW
var imposter = {};
imposter.getFeints = ninja1.getFeints; // makes getFeints function of ninja1 accessible through the imposter object

assert(ninja1.feints === undefined, 'error: could access private variable'); // cannot access feints private variable
assert(ninja1.getFeints() === 1, 'error: could not access private variable via accessor method'); // can ONLY access private var with this method
console.log(ninja1.getFeints());
console.log(ninja1);

assert(imposter.getFeints() === 1, 'error: imposter cannot access ninja1\'s getFeints function'); // NEW
console.log(imposter.getFeints());
console.log(imposter);

var ninja2 = new Ninja(); // instantiate a ninja

assert(ninja2.getFeints() === 0, 'error: could not access private variable via accessor method'); // another instance has its own private variable
console.log(ninja2.getFeints());
console.log(ninja2);