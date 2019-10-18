var assert = require('assert');

assert(typeof fun === "function", "error: typeof fun is wrong"); // IMPORTANT: function declaration can be accessed any time. They are HOISTED  to the top of a function scope or global scope
assert(typeof myFunExpr === "undefined", "error: typeof myFunExpr is wrong"); // IMPORTANT: function expressions and arrow functions cannot be accessed before they are declared
assert(typeof myArrowExpr === "undefined", "error: typeof myArrowExpr is wrong");

function fun() {} // function declaration
var myFunExpr = function() {}; // function expression
var myArrowExpr = (x) => x; // arrow function . Arrow functions cannot be declarations

// IMPORTANT: HOISTING IN SUMMARY, the order of execution is:
// 1st ) Function declarations and their arguments
// 2nd ) variable declarations, function expressions and arrow functions
// 3rd ) the rest of the code