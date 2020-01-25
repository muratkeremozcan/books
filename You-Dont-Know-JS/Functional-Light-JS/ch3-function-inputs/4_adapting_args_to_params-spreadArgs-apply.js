{ // this pattern is handy if an array will be passed in but you want the contents as individual parameters
  // it is unary: only 1 argument, an array, will be passed in. But, you still get to address individual inputs
  function foo( [x, y, ...args] = [] ) { 
    // return x;
    // return y;
    return args; 
  } 
  foo( [1,2] ); //?
  foo( [1,2,3,4,5] ); //?
}

{ // sometimes you don't have the ability to change the function declaration to use array destructuring
  // foo expects 2 params, but bar sends 1 argument: [3, 9]
  // either need to use destructuring: f([x, y])
  // or have bar call fn with spread operator :  fn(...[3, 9])
  function foo(x, y) {
    console.log(x + y);
  }

  function bar(fn) {
    fn([3, 9])
  }
  bar(foo); //?
  
  // in this situation you can use a helper function 
  // that spreads out a single received array as its individual arguments:
  // in libraries like Ramda it’s commonly called apply(..).
  function spreadArgs(fn) {
    return function spreadFn(argsArr) {
      return fn(...argsArr); // function call: spread
    }
  }
  var spreadArgsArrow = fn => argsArr => fn(...argsArr);

  bar(spreadArgs(foo));

  // you can also have a utility to gathers individual args into a single array
  // perhaps because we want to adapt a function with array parameter destructuring to another utility that passes arguments separately.
  function gatherArgs(fn) {
    return function gatheredFn(...argsArr) { // function declare : gather
      return fn(argsArr);
    }
  }
  var gatherArgsArrow = fn => (...argsArr) => fn(argsArr);

  // this enables reduce, which will be covered later.
  // reduce repeatedly calls its reducer function with two individual parameters, which we can now gather together:
  function combineFirstTwo( [v1, v2] ) {
    return v1 + v2;
  }

  [1,2,3,4,5].reduce(gatherArgs(combineFirstTwo)); //?
}  
