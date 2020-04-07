// tagged template literals = tagged string literals

var desc = 'awesome'; 

// what gets passed to the function when it gets invoked as a tag for a string literal?
/** 
 * @strings array of all the plain strings 
 * @values result of the interpolated expression  */
function foo(strings, ...values) { // function declaration! spread operator
  console.log(strings);
  console.log(values);
}

// special kind of function here. It doesn't need (..)
foo`Everything is ${desc}!`; //?

// if we return a function, you use (..) to invoke the inner function
function bar() {
  return function baz(strings, ...values) {
    console.log(strings);
    console.log(values);
  }
}
bar()`all is ${desc} `; //?
