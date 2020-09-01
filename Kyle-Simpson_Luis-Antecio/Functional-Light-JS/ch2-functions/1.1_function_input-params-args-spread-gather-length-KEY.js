{
  function foo(x = 3, y, z) { // parameters are function signature
    return { x, y, z };
  }

  var a = 3;
  // arguments are what you pass in
  foo(a, a * 2); //?

  // using default parameters can lead to more complexity in terms of reading and understanding the variations of how a function is called
  // use sparingly, when you need to
  foo(); //?
  foo(undefined); //?
  foo(undefined, 5); //?
  foo(null); //?
  foo(0); //?
}

// counting inputs
// Arity is the number of parameters in a function declaration.
// function with arity 1 is also called “unary”, a function with arity 2 is also called “binary”, 
// a function with arity 3 or higher is called “n-ary”.
{
  function bar(x, y, z) {
    return { x, y, z };
  }
  // arity can be inspected with .length property
  // think of .length a piece of metadata that describes something about the intended usage of the function
  bar.length; //?

  // imagine a case where an fn function reference could expect one, two, or three arguments, 
  // but you always want to just pass a variable x in the last position:
  var x = 3;
  if (bar.length == 1) {
    bar(x); //?
  }
  else if (bar.length == 2) {
    bar(undefined, x); //?
  }
  else if (bar.length == 3) {
    bar(undefined, undefined, x); //?
  }
}

// CAREFUL! default parameters, rest/gather operator, passing in an object all confuse arity
{
  function foob(x, y = 2) { }
  function barf(x, ...args) { }
  function baz({ a, b }) { }
  function bazo([ a, b ]) { }
  foob.length; //?
  barf.length; //?
  baz.length; //?
  bazo.length; //?
}

// in contrast to arity / number of parameters, you can count the number of arguments 
// never access arguments positionally, like arguments[1]. Stick to arguments.length only, and only if you must.
{
  function foo(x, y, z) { 
    return arguments.length;
  }
  foo(3, 4); //?
}

// A function signature that accepts an indeterminate amount of arguments is referred to as a variadic function.
// if you really want to design a function that can account for an arbitrary number of arguments to be passed in, 
// use ... args (or whatever name you like) on the end.
{
  function foo(x, y, z, ...args) { // rest/gather operator
    // args will always be an array, even if it’s empty. 
    // But it will not include values that are assigned to the x, y, and z parameters, 
    // only anything else that’s passed in beyond those first three values
    return [x, y, z, args];
    // you can spread the args using spread operator (toggle below return statement instead of the above)
    // return [x, y, z, ...args];
  }
  foo(); //?
  foo(1, 2, 3); //?
  foo(1, 2, 3, 4); //?
  foo(1, 2, 3, 4, 5); //?
}

// You can use the ... operator in the parameter list even if there’s no other formal parameters declared
// you can safely use args.length in this form
{ 
  function foo(...args) { return args.length; }
  foo(1, 2, 3); //?
}
