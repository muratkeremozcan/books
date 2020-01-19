// A function that receives or returns one or more other function values has the special name: higher-order function.
// Functions that treat other functions as values are higher-order functions by definition.


{
  function forEach(list, fn) {
    for (let v of list) {
      fn(v);
    }
  }

  // forEach(..) is a higher-order function because it receives a function as an argument.
  forEach([1, 2, 3, 4, 5], function each(val) {
    console.log(val);
  });
}

{ // A higher-order function can also output another function
  function foo() {
    return function inner (msg) {
      return msg.toUpperCase();
    };
  }

  var f = foo();

  f('hello'); //?
}

{ // you can output a return as such
  function foo() {
    return bar( function inner(msg) {
      return msg.toUpperCase();
    });
  }
  
  function bar (func) {
    return func('Hello');
  }

  foo(); //?
}
