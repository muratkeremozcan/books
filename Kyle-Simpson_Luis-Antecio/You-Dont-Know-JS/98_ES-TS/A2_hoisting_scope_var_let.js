// hoisting, var, let, scope

function foo() {
  for (var i = 0; i<10; i++) { 

  }
  // in JS, all variable declarations with var are moved to the top of the execution context (even when variable is inside a code block)
  // change the var to let and i will be undefined
  i //?

}
foo();

////////////////

var customer = "Joe";

(function() {
  customer //?
  if(true) {
    var customer = 'Mary'
    customer //?
    // in ES5, variable declarations are hoisted to the top of the scope (the function) 
      // but variable initializations with values are not hoisted
      // you can use let instead of var or ask for the value after the if block
  }
})();
customer //?


////////

// function declarations are hoisted, you can invoke a function before it's declared
functionDeclaration();
function functionDeclaration() {
  console.log('I am doing something');
}

// function expressions are like variable initializations; they are not hoisted
  // you need to move it after the function expression for it to work
  var functionExpression = function() {
    console.log('I am doing something');
  }
  functionExpression();

  ///////