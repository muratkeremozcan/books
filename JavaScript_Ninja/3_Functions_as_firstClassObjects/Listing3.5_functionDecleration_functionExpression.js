function myFunctionDeclaration() { // standalone FUNCTION DECLARATION
  function innerFuncion() {} // inner FUNCTION DECLARATION
}
var myFunc = function() {}; // FUNCTION EXPRESSION: as variable declaration 
myFunc(function(){ // FUNCTION EXPRESSION: as argument
  return function(){}; // FUNCTION EXPRESSION: as return value 
});

(function namedFunctionExpression() { // named FUNCTION EXPRESSION: immediately invoked
})();
(function (){})();  // FUNCTION EXPRESSION: immediately invoked
(function (){}());  // alternate syntax. I like this better

// FUNCTION EXPRESSION: immediately invoked, as arguments to unary operators
// instead of using paranthesis around the function expression, we can use unary operators
+function(){}();
-function(){}();
!function(){}();
~function(){}(); // inverts the bits of an operand https://devdocs.io/javascript/operators/bitwise_operators 