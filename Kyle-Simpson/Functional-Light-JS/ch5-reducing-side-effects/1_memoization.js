// memoization: for the sake of performance optimization, hiding the caching of results so they cannot be observed by any other part of the program.

// var cache = []; 
// instead of having the cache here and memoization being a function declaration (as opposed to function expression = IIFE)
// we contain the side effects of specialNumber() inside the scope of memoization IIFE
// now, no other parts of the program can observe cache

var specialNumber = (function memoization() {
  var cache = [];

  return function specialNumber(n) {
    // if special number already calculated, get it from the cache
    if (cache[n] !== undefined) {
      return cache[n]; //?
    }

    var x = 1, y = 1;

    for (let i = 1; i <= n; i++) {
      x += i % 2;
      y += i % 3;
    }

    cache[n] = (x * y) / (n + 1); //?

    return cache[n];
  };
})();


specialNumber(6); //?
specialNumber(42); //?
specialNumber(1E6); //?
// memoized from cache!
specialNumber(1E6); //?

// The purpose of reducing side causes/ effects is not per se to have a program where they aren’t observed, 
// but to design a program where fewer of them are possible
