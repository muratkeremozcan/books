{ // what if you want to pass an array of values as the arguments?
  function foo(...args) { // parameters, gather
    return args[3];
  }

  var arr = [1, 2, 3, 4, 5];
  // arguments, spread
  foo(...arr); //?
  // multiple values and spreading can be interleaved
  foo(0, ...arr, 6, 7, ...[8, 9]); //?
  foo(...[1,2,3,4,5]); //?
}

{ // Parameter Destructuring
  
  // what if you want an array of values instead of individual argument values
  // Destructuring is a way to declare a pattern for the kind of structure (object, array, etc.) that you expect to see,
  // and how decomposition (assignment) of its individual parts should be processed.

  // declarative code focuses on what the outcome should be
  function foo( [x, y, ...args] = [] ) {  // default parameter [] is optional
    return args; 
  } 
  foo( [1,2] ); //?
  foo( [1,2,3,4,5] ); //?

  // Imperative code (such as the manual assignments like this snippet) focuses more on how to get the outcome.
  function bar (params) {
     var x = params[0]; 
     var y = params[1]; 
     var args = params.slice( 2 );
     return args;
  }
  bar( [1,2] ); //?
  bar( [1,2,3,4,5] ); //?

  // foo is more readable because the destructuring hides the unnecessary details of how to manage the parameter inputs
}

{ // named arguments: at the call-site, labeling an input value to indicate which parameter it maps to.

  // just like we can destructure arrays, we can destructure objects
  function foo ( {x, y} = {} ) {  // default parameter {} is optional
    console.log(x, y);
  }
  // We pass in an object as the single argument, and it’s destructured into two separate parameter variables x and y, 
  // which are assigned the values of those corresponding property names from the object passed in.
  // It didn’t matter that the x property wasn’t on the object; it just ended up as a variable with undefined like you’d expect.
  // another benefit of named arguments, by virtue of being specified as object properties, are not fundamentally ordered
  // The call-site is no longer cluttered by ordered-placeholders like undefined to skip a parameter
  foo( { y: 3} ); 
} 