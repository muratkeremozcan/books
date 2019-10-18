// 'use strict';
var assert = require('assert');

// Listing 4.5 strict vs non-strict : function context (THIS) is UNDEFINED (in strict mode) , GLOBAL (in  non-strict mode)
function nonStrictMode(){
  return this;
}
function strictMode(){
  "use strict";
  return this;
}

console.log(nonStrictMode()); // function context (THIS) is GLOBAL (in  non-strict mode)

console.log(strictMode()); // function context (THIS) is UNDEFINED (in strict mode)
// when a function is invoked as a function - as opposed to a object.METHOD - no objet has been specified on which the function should be invoked. So the context is UNDEFINED