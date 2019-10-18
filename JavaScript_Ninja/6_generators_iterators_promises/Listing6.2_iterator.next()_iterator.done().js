var assert = require('assert');

function* WeaponGenerator() { // * is the syntax for generator function
  yield "Katana"; // yield keyword produces values one at a time, when the generator is asked for a value
  yield "Wakizashi"; // as a response to a call, the generator executes its code until it reaches a YIELD keyword
  yield "Kusarigama"; // EXPERIMENT: experimenting with result.done
}

// iterator.next()  iterator.done()
const weaponsIterator = WeaponGenerator(); // NEW: ITERATOR: calling a GENERATOR creates an ITERATOR through which we control the generator's execution
const result1 = weaponsIterator.next(); // NEW: calling the iterator's NEXT method requests a new value from the generator
const result2 = weaponsIterator.next();
const result3 = weaponsIterator.next(); // EXPERIMENT: calling next, without a 3rd object to yield
const result4 = weaponsIterator.next(); // EXPERIMENT: calling next, without a 3rd object to yield

console.log('iterated object types are : ', result1 + ' ' + result2 + ' ' + result3); // [object object] is returned for the iterated objects
console.log('iterated values are : ', result1.value + ' ' + result2.value + ' ' + result3.value); // the VALUE of the iterated objects is accessed with .value property
console.log('is the 1st iterated object done? ', result1.done); // false
console.log('is the 2nd iterated object done? ', result2.done); // false
console.log('is the 3rd iterated object done? ', result3.done); // true. EXPERIMENT: calling next, without a 3rd object to yield -> when there is no more code to execute, the generator returns UNDEFINED
console.log('is the last object done? ', result4.done, '. And its value is:', result4.value);

assert (typeof result1 === 'object' && typeof result2 ==='object' && typeof result3 ==='object', 'error: the type of the iterated objects is not object');
assert (result1.value === 'Katana' && result2.value === 'Wakizashi' && result3.value === 'Kusarigama', 'error: the value of the iterated objects are not correct');
assert (!result1.done && !result2.done); // EXPERIMENT when there is no more code to execute, .done returns TRUE