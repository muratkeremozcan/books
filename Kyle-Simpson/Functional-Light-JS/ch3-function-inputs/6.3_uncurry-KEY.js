// what if you want to uncurry a function?  ex: f(1)(2)(3) to g(1,2,3)
// common use case is a function that comes out curried as a result of some other set of operations
import { curry } from './6.1_curry_KEY';

export function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn;
    for (let arg of args) {
      ret = ret(arg);
    }
    return ret;
  }
}
var uncurry_arrow = fn => (...args) => {
  var ret = fn;
  for (let arg of args) {
    ret = ret(arg);
  }
  return ret;
}

////
function sum(...nums) {
  var sum = 0;
  for (let num of nums) {
    sum += num;
  }
  return sum;
}

var curriedSum = curry(sum, 5);
var uncurriedSum = uncurry(curriedSum);
curriedSum(1)(2)(3)(4)(5); //?
uncurriedSum(1, 2, 3, 4, 5); //?
uncurriedSum(1, 2, 3)(4)(5); //?