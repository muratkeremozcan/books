function add(x, y) {
  return x + y;
}
// we have a list of numbers and we want to add a certain number to each of them, but we want to use add function, not adder
[1, 2, 3, 4, 5].map(function adder(val) {
  return add(3, val);
}); //?

// can't pass add directly to map because the signatures of add and adder do not match
// we can adapt the signature of add using the partial() function
export default function partial(fn, ...presetArgs) { // (add, 3)
  return function partiallyApplied(...laterArgs) { // (y)
    return fn(...presetArgs, ...laterArgs); // add(x, y)
  };
}
// present arg is 3, laterArgs are the additional args that come out of add function: (3, 1) , (3, 2), (3, 3) 
[1, 2, 3, 4, 5].map(partial(add, 3)); //?



// reversing arguments
// We could create a utility that wraps a function to reverse its argument order:
export function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  }
}
var reverseArgs_arrow = fn => (...args) => fn(...args.reverse());

// usage:
function join() {
  return Array.from(arguments).join(',');
}

join(1, 2, 3); //?
reverseArgs(join)(1, 2, 3); //?

//

// reverseArgs and partially apply the rightmost arguments
export function partialRight(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...laterArgs, ...presetArgs);
  };
}
var partialRight_arrow = (fn, ...presentArgs) => (...laterArgs) => fn(...laterArgs, ...presentArgs);

// usage: (feels contrived)
// The value "z:last" is only applied to the z parameter in the case where f(..) is called with exactly two arguments (matching x and y parameters).
// In all other cases, the "z:last" will just be the rightmost argument, however many arguments precede it.
function foo(x, y, z, ...rest) {
  console.log(x, y, z, rest);
}

var f = partialRight (foo, 'z:last');
f(1, 2); 
// f(1)
// f(1,2,3);

