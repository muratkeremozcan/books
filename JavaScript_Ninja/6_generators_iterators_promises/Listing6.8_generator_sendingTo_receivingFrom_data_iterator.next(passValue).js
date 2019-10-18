var assert = require('assert');

// yield keyword produces values one at a time, when the generator is asked for a value 
// as a response to a call, the generator executes its code until it reaches a YIELD keyword
function* NinjaGenerator(action) { // generator function
  const imposter = yield("Hattori " + action); // INITIAL RUN SUSPENDED: at this point on initial run, an object {value: 'Hattori Skulk', done: false} has been yielded, 
  // but the value of the expression not yet been assigned to the const

  // 2ND ITERATOR is triggered with .next(<passed in argument>)
  // WHICH MEANS: the NEXT yield statement will be executed, but before that the PREVIOUS yield expression's value is set to the new argument passed in from the new next() method call "Hanzo"
  console.log(imposter);
  // assert(imposter === 'Hanzo', 'error:the generator has NOT been infiltrated' );

  yield("Yoshi (" + imposter + ") " + action);
}

// Providing data when FIRST triggering the generator
const ninjaIterator = NinjaGenerator("skulk"); // if you need to supply an initial value to the generator, you can do so when calling the generator itself

const result1 = ninjaIterator.next(); // iterator.next() triggers the generator, FIRST CALL stores 'Hattori skulk' into result1. value
console.log(result1); // the produced object
console.log(result1.value); // the value property of the produced object
console.log(result1.done); // the done property of the produced object
assert(result1.value === "Hattori skulk", "error: result1 is not correct");

// We can send DATA into the the generator by passing data to the next() method, wake up the generator!
// IMPORTANT: by calling the iterator's next method with an argument, we send data back to the generator
const result2 = ninjaIterator.next("Hanzo"); // iterator.next() triggers the generator AGAIN, the SECOND CALL stores "Hanzo" into the generator
console.log(result2);
console.log(result2.value);
console.log(result2.done);
// assert(result2.value === 'Yoshi (Hanzo) skulk', 'error: result2 is not correct');
