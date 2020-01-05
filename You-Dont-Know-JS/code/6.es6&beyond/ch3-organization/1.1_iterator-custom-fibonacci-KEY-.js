// in addition to ES6 built-in iterators (arrays, strings, generators, collections/typedArrays),
// you can make your own custom iterators

// an iterator needs a next() function and a return value
// The Fib[Symbol.iterator]() method when called returns the iterator object with next() and return(..) methods on it. 
// State is maintained via n1 and n2 variables, which are kept by the closure.

var Fib = {
  [Symbol.iterator]() {  // [Symbol.iterator]() specifies the default iterator for an object. Used by for...of.
    var n1 = 1, n2 = 1;

    return {
      // first make the iterator an iterable
      [Symbol.iterator]() {
        return this;
      },

      // define next value
      next() {
        var current = n2; //?
        n2 = n1; //?
        n1 = n1 + current; //?
        return {
          value: current,
          done: false
        } //?

      },

      // define return value
      return(v) {
        console.log('Fibonacci sequence abandoned');
        return {
          value: v,
          done: true
        };
      }

    };
  }
};

for (var v of Fib) {
  console.log(v);
  if (v > 3) break;
}