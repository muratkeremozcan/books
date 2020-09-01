// When using ES6’s default parameter values, the default value is applied to the parameter if you either omit an argument, or you pass an undefined value in its place:
// From the ES6 default parameter values perspective, there’s no difference between omitting an argument and passing an undefined


function foo( a = 42, b = a + 1 ) {
  console.log( a, b );
}
foo();
foo(undefined); 
foo(5);
foo(void 0, 7); 
foo(null, 7); 

// Even though the default parameter values are applied to the a and b parameters, if no arguments were passed in those slots, the arguments array will not have entries.
function foob(a = 42, b = a +1 ) {
  console.log(
    arguments.length, a, b, arguments[0], arguments[1]
  );
}

foob();
foob(10);
foob(20, 30);