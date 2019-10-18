var assert = require('assert');

function* WeaponGenerator() { // * is the syntax for generator function
  yield "Katana"; // yield keyword produces values one at a time, when the generator is asked for a value
  yield "Wakizashi";
  yield "Kusarigama"; // if you had a return instead of yield, it would not let out that value
}
for(let weapon of WeaponGenerator()) { // calling a generator does not execute the generator function, instead it creates an object called ITERATOR
  console.log(weapon);
  assert(weapon !== undefined, 'error: values are undefined');
}


