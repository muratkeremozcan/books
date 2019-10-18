var assert = require('assert');
function* IdGenerator() {
  let id = 0; // to keep track of the id
  while(true) { // generates infinite ids
    yield ++id;
  }
}
const idIterator = IdGenerator(); // ITERATOR: calling a GENERATOR creates an ITERATOR through which we control the generator's execution

// NEXT() method requests a new value from the generator . An object is produced { value: 1, done: false}
// .VALUE property gives the value of the current produced object
// const initialIteratorValue = idIterator.next().value;
// console.log(initialIteratorValue);

const ninja1 = { id: idIterator.next().value }; // constant with a property called id, with the value of idIterator.next().value, 1 to begin with and iterates
console.log('ninja id property\'s value:' + ninja1.id );

const ninja2 = { id: idIterator.next().value };
const ninja3 = { id: idIterator.next().value };
console.log('ninja id property\'s value:' + ninja2.id );
console.log('ninja id property\'s value:' + ninja3.id );


