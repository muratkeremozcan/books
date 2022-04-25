// const cache = []
// instead of having the cache here and memoization being a function declaration (as opposed to function expression = IIFE)
// we contain the side effects of specialNumber() inside the scope of memoization IIFE
// now, no other parts of the program can observe cache

// another example at Functional-Light-JS/ch5-reducing-side-effects/1_memoization.js

const efficientSquare = (function () {
  // (1) hold the cache somewhere
  const cache = [];

  return function square(n) {
    // (3) if we have the result in the cache, use that
    if (cache[n]) return cache[n];

    let result = 0;

    for (let i = 0; i < n; i++) {
      for (let j = -0; j < n; j++) {
        result += 1;
      }
    }

    // (2) every time we call the function, we store the result in the cache
    cache[n] = result;
    return result;
  };
})();

// the subsequent calls are 0.01 ms
efficientSquare(3000); /*?.*/
efficientSquare(3000); /*?.*/
efficientSquare(3000); /*?.*/
efficientSquare(3000); /*?.*/
