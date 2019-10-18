function* NinjaGenerator() {
  try {
    yield "Hattori";
    fail('the exception did not occur. This fail should not be reached at all!');
  } catch (e) {
    console.log(e);
  }
}
const ninjaIterator = NinjaGenerator(); // create the iterator
const result1 = ninjaIterator.next(); // get 1 value from the generator, using iterator.next()
console.log('we got ', result1.value); // get the value from using the iterator.next()

ninjaIterator.throw('Aha! We caught an exception!'); // send a value to the generator using throw exception