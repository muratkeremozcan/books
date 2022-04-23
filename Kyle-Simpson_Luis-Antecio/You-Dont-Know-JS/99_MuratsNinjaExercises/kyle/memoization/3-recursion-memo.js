// inefficient, takes 5 seconds for fib 40
function fib(n) {
  if (n <= 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

fib(40); /*?.*/
fib(2); //?

// with memoization it's instant
// (1) hold state somewhere (held in the arg)
function fibMemo(n, cache = []) {
  // (3) if we have the result somewhere, use that
  if (cache[n]) return cache[n];

  let result;

  if (n <= 1) {
    result = 1;
  } else {
    result = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  }

  // (2) every time we call the function, we store the result
  cache[n] = result;
  return result;
}

fibMemo(40); /*?.*/
