import partial from './5.2_partial-add_reverseArgs-KEY';

// currying unwinds a single higher-arity function into a series of chained unary functions

// Currying is a special form of partial application where the arity is reduced to 1, 
// with a chain of successive chained function calls, each which takes one argument. 
// Once all arguments have been specified by these function calls, the original function is executed with all the collected arguments. 
// You can also undo a currying.
export function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArg) {
      var args = [...prevArgs, nextArg];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

var curry_arrow = (fn, arity = fn.length, nextCurried) =>
  (nextCurried = prevArgs =>
    nextArg => {
      var args = [...prevArgs, nextArg];
      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    })([]);

// usage
function add(x, y) {
  return x + y;
}

[1, 2, 3, 4, 5].map(curry(add)(3)); //?
// remember adding 3 to each number? Currying is similar to partial.
[1, 2, 3, 4, 5].map(partial(add, 3)); //?

// currying may be helpful over partial 
// in the case where you know ahead of time that add(..) is the function to be adapted, but value 3 is not known yet
var adder = curry(add);
[1,2, 3, 4, 5].map(adder(3)); //?


// another example, adding a list of numbers together
export function sum(...nums) {
  var total = 0;
  for (let num of nums) {
    total += num;
  }
  return total;
}
sum(1, 2, 3, 4, 5); //?

// with currying
export var curriedSum = curry(sum, 5);
curriedSum(1)(2)(3)(4)(5); //?

// If you wanted to use partial application to specify one parameter (or several!) at a time, 
// you’d have to keep calling partial(..) again on each successive partially applied function. 
// By contrast, curried functions do this automatically, making working with individual arguments one-at-a-time more ergonomic

// visualizing curriedSum
function curriedSum_visual(v1) {
  return function(v2) {
    return function(v3) {
      return function(v4) {
        return function(v5) {
          return sum(v1, v2, v3, v4, v5);
        };
      };
    };
  };
}
var curriedSum_visual_arrow  = v1 => v2 => v3 => v4 => v5 => sum( v1, v2, v3, v4, v5 );

