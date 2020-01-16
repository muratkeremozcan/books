{ // what if you want to pass an array of values as the arguments?
  function foo(...args) { // parameters, gather
    return args[3];
  }

  var arr = [1, 2, 3, 4, 5];
  // arguments, spread
  foo(...arr); //?
  // multiple values and spreading can be interleaved
  foo(1, ...arr, 6, 7, ...[8, 9]); //?
}

{ // Parameter Destructuring
  function foo([x, y,... args] = []
    return args[2];
  }
  // what if you want an array of values to be passed in instead of individual argument values?

  foo(...[1, 2, 3, 4]); //?
}