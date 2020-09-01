// direct recursion: when a function calls itself 

function foo(x) {
  if (x < 5) return x;
  return foo(x/2);
}

foo(16); //?


///////
//// prime number

/**
 * try each integer from 2 up to the square root of the num being checked, 
 * to see if any of them divide evenly (% mod returning 0) into the number. If any do, it’s not a prime. 
 * Otherwise, it must be prime. 
 * The divisor + 1 uses the recursion to iterate through each possible divisor value.
 */
function isPrime(num, divisor = 2) {
  if (num < 2 || (num > 2 && num % divisor == 0)) {
    num;
    return false;
  }
  if (divisor <= Math.sqrt(num)) {
    num; 
    return isPrime(num, divisor + 1);
  }
  return true;
}
isPrime(5); //?


//////
//// fibonacci: calls itself twice (binary recursion)

function fibonacci(n){
  if (n <= 1) return n;
  return fibonacci(n-2) + fibonacci(n-1);
}

fibonacci(3); //?