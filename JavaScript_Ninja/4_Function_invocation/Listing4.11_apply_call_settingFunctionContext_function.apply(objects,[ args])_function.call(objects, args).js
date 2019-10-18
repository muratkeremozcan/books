'use strict';
var assert = require('assert');

function juggle() { // this function adds the arguments and puts the result onto the passed in object as the function context
  var result = 0;
  for (var n = 0; n < arguments.length; n++) {
    result += arguments[n];
  }
  // this.result = result;
  return result;
}
var ninja1 = {}; // empty objects initially
var ninja2 = {};

// IMPORTANT: function.apply(objects, [args])
juggle.apply(ninja1, [1,2,3,4]); // apply takes the OBJECT as FUNCTION CONTEXT and an ARRAY of values to be used as ARGUMENTS
// IMPORTANT: function.call(object, args)
juggle.call(ninja2, 5,6,7,8); // call takes the OBJECT as FUNCTION CONTEXT and the ARGUMENTS are passed in DIRECTLY
console.log(juggle.apply(ninja1, [1,2,3,4])); // use apply if your arguments are already in an array.
console.log(juggle.call(ninja2, 5,6,7,8)); //  Use call otherwise