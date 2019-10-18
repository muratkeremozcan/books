var assert = require('assert');

function* WeaponGenerator() { // * is the syntax for generator function
  yield "Katana"; // yield keyword produces values one at a time, when the generator is asked for a value
  yield "Wakizashi"; // as a response to a call, the generator executes its code until it reaches a YIELD keyword
  yield "Kusarigama";
  yield "SLEDGEHAMMA!";
}
const weaponsIterator = WeaponGenerator(); // calling a GENERATOR creates an ITERATOR through which we control the generator's execution
// first iterated object is = { value: 'Katana', done: false }

let item; // NEW: stores the items of the generated sequence of objects. IMPORTANT: we need this because weaponsIterator.next() will keep changing as it yields objects
while(!(item = weaponsIterator.next()).done) { // did .next() yield an object? When it is done yielding, done will be true
  // set the iterated object to item, and check if done becomes true , if true then break the loop
  console.log(item.value); // NEW: on each loop iteration, get one value from the generator and output it. stop if no more values to produce
}