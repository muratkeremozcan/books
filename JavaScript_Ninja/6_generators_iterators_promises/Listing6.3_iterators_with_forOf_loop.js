var assert = require('assert');

function* WeaponGenerator() { // * is the syntax for generator function
  yield "Katana"; // yield keyword produces values one at a time, when the generator is asked for a value
  yield "Wakizashi"; // as a response to a call, the generator executes its code until it reaches a YIELD keyword
  yield "Kusarigama";
  yield "SLEDGEHAMMA!";
}
// const weaponsIterator = WeaponGenerator();
// let item;
// while(!(item = weaponsIterator.next()).done) { // set iterator.next()'s value to item. iterator.next().done should give false until true and done
//   console.log(item.value);
// }

// NEW: the for of loop is used to ITERATE OVER ITERATORS
// IMPORTANT: instead of manually calling the next() method and checking if we are done, we can use the for of loop
// IMPORTANT: The best way to iterate any iterable (an object which supports @@iterator), is to use for..of
for(let item of WeaponGenerator()) {
  console.log(item);
}
