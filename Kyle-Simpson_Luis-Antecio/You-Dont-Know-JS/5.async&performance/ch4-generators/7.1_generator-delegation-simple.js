function *foo() {
  console.log('foo() starting');
  yield 3;
  yield 4;
  console.log('foo() finished');
  // As soon as the it iterator control exhausts the entire *foo() iterator, it automatically returns to controlling *bar().
}

function *bar() {
  yield 1;
  yield 2;
  yield *foo(); // yield delegation
  yield 5;
}

var it = bar(); 

it.next().value; //?
it.next().value; //?

it.next().value; //?
it.next().value; //?

it.next().value; //?
it.next(); //?


// yield * yields iteration control, not generator control; 
// when you invoke the *foo() generator, you’re now yield-delegating to its iterator. 
// yield * is a syntactic shortcut for manually iterating over the steps of *foo() while inside of *bar().
