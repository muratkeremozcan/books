// proxy helps control access to the object by using the traps (get and set) and helps define custom actions
// used for:
// logging
// performance measurements THIS EXAMPLE
// data validation
// auto-populating object properties

function isPrime(number) {
  if (number < 2) { return false; }
  for (let i = 2; i < number; i++) { // grab the value, divide it with every number from 2 to the value-1 itself
    if (number % i === 0) { return false; } // if there is remainder (9 % 2 = 1), increment i (9 % 3 = 0, not prime, so break)
  } // if it goes through the loop without returning a 0 remainder, it's a prime number
  return true; // ex: if you pass 5, 5 % 2 = 1, 5%3=2, 5%4=1, 5%5-> it never gets there
}
isPrime = new Proxy (isPrime, { // wraps the isPrime function within a proxy, that has a trap that is called whenever the function is called
  apply: (target, thisArg, args) => { // apply trap, executed. starts a stop-watch with built-in console.time method
    console.time("isPrime"); // starts a timer called isPrime
    const result = target.apply(thisArg, args);
    console.timeEnd("isPrime"); // stops the timer and outputs the result
    return result;
  }
});
isPrime(1299827);