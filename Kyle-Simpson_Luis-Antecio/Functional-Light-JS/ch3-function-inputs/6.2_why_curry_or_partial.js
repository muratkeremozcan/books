import { partial } from '../fp-tool-belt';
import { curriedSum, sum } from './6.1_curry_KEY';

// sum(..) is more clear, why curry and partial?

sum(1, 2, 3, 4, 5); //?

partial(sum, 1, 2)(3); //?

curriedSum(1)(2)(3)(4)(5); //?

// currying and partial application allow you to separate when and where separate arguments are specified, 
// whereas traditional function calls require all the arguments to be present at the same time.
// If you have a place in your code where you’ll know some of the arguments 
// and another place where the other arguments are determined, currying or partial application are very useful.

// Also, composition of functions is much easier when there’s only one argument.
// a function that ultimately needs three arguments, if curried, becomes a function that needs just one, three times over.


// Loose curry
// many JS libraries support loose currying; multiple arguments for each curried-call
// each curried-call accepts one or more arguments
export function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = [...prevArgs, ...nextArgs]

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

var curriedSum_loose = looseCurry(sum, 5);
curriedSum_loose(1)(2,3)(4,5,6,7); //?
