// "use strict"; // function context (THIS) : UNDEFINED (in strict mode) , GLOBAL (in  non-strict mode)
var assert = require('assert');

/////////////////////////////////////////////////////////////////////////
// invoking the function as a FUNCTION, function DECLARATION and EXPRESSION have the same function context (THIS) when invoking the function
function whatsMyContext() { // function DECLARATION
  return this; // if you do this in typescript, THIS is the function itself. In JS this can be global or undefined.
}
console.log(whatsMyContext()); // invoking the function as a FUNCTION, function context : UNDEFINED (or global in non-strict)

var getMyThis = whatsMyContext; // getMyThis variable created, gets a reference to whatsMyContext function, NOT AN INSTANCE OF THE FUNCTION
console.log(getMyThis()); // invoking the function as a FUNCTION, function context : UNDEFINED (or global in non-strict)

var whatsMyContextFunctionExpression = function (){ // function EXPRESSION
  return this;
};
console.log(whatsMyContextFunctionExpression()); // invoking the function as a FUNCTION, function context: UNDEFINED  (or global in non-strict)
/////////////////////////////////////////////////////////////////////////

// INVOKING FUNCTIONS AS METHODS ALLOWS US TO WRITE JS IN OBJECT ORIENTED MANNER, because the function context (THIS) belongs to the object the method got invoked at
var ninja1 = { // an object created with getMyThis property that references the whatsMyContext function
  getMyThis: whatsMyContext
};

// to test this toggle ninja1 and 2 to each other
assert(ninja1.getMyThis() === ninja1, 'function not working with ninja1'); // invoking the function as a METHOD, function context: NINJA1
console.log(ninja1.getMyThis());

var ninja2 = { // an object created with getMyThis property that references the whatsMyContext function
  getMyThis: whatsMyContext
};
assert(ninja2.getMyThis() === ninja2, 'function not working with ninja2'); // invoking the function as a METHOD, function context NINJA2
console.log(ninja1.getMyThis());
