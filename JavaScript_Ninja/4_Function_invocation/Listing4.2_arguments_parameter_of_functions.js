var assert = require('assert');

// arguments and this are 2 implicit parameters in functions
function sum() { // function with no parameters
  var sum = 0;
  // arguments parameter has a length property, which gives us the number of arguments passed in to the function
  // arguments parameter can also be used to access each individual parameter passed in
  // BUT it's not a JS array! It is an array-like construct
  for (var i = 0; i < arguments.length; i++) { // but we can iterate through any passed in arguments
    sum += arguments[i];
  }
  return sum;
}

// function called with any number of parameters called works
assert(sum(1,2) === 3, "error adding numbers");
assert(sum(1, 2, 3) === 6, "error adding numbers");
assert(sum(1, 2, 3, 4) === 10, "error adding numbers");
console.log(sum(4, 5, 10, 20));