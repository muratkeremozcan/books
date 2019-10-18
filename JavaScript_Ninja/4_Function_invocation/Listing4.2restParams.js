var assert = require('assert');

function sum(...parameters) { // the difference & advantage in rest parameters is we can use any array methods on it
  var sum = 0;
  for (var i = 0; i < parameters.length; i++) { // we can iterate through any passed in arguments
    sum += parameters[i];
  }
  return sum;
}

// function called with any number of parameters called works
assert(sum(1,2) === 3, "error adding numbers");
assert(sum(1, 2, 3) === 6, "error adding numbers");
assert(sum(1, 2, 3, 4) === 10, "error adding numbers");
console.log(sum(4, 5, 10, 20));