var assert = require('assert');
function isPrime(value) {
  if (!isPrime.answers) { // Using answers property as cache here
    isPrime.answers = {}; // if no cache, create a cache. Only occurs on the FIRST CALL to the function
  }
  // check if the passed in value has already been cached. If previously computed values are in the answers cache, this gives a performance benefit because we do not have to calculate again if the number is prime
  if (isPrime.answers[value] !== undefined) { // if the value of the property/cache is defined/it exists/has been cached
    return isPrime.answers[value]; // use the arg 'value' as the property KEY, give us the value: TRUE or FALSE (is value prime or not?)
  }
  // if the value of the property/cache is not defined ( we do not know if it is prime or not), perform calculations to determine if the value is a prime number
  var prime = value !== 1; // if value is 1, prime is FALSE, if it is something else, prime may be TRUE, if it makes it to line 19
  for (var i = 2; i < value; i++) { // grab the value, divide it with every number from 2 to the value-1 itself
    if (value % i === 0) { // if there is remainder (9 % 2 = 1), increment i (9 % 3 = 0, not prime, so break)
      prime = false; // if you pass 5, 5 % 2 = 1, 5%3=2, 5%4=1, 5%5-> it never gets there, 5 is prime
      break;
    }
  }
  // store the result of calculations in the cache as we return it
  return isPrime.answers[value] = prime; // store the TRUE/FALSE state
}
assert(isPrime(7), 'if no assert error: value is prime, if assert error: value is not prime');
assert(isPrime.answers[7], 'if no assert error: The answer was cached, if assert error: value was not cached');
console.log(isPrime(7));
console.log(isPrime(8));
console.log(isPrime.answers[7]);
console.log(isPrime.answers[8]);
console.log(isPrime.answers);

// previously computed values are in the answers cache, this gives a performance benefit
console.log(isPrime(7));
console.log(isPrime(8));