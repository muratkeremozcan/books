// a generator can be treated as a producer of values that we extract one at a time through an iterator interface’s next() calls.
// a generator itself is not technically an iterable, though it’s very similar — when you execute the generator, you get an iterator back:
// we can implement the number producer from the previous example with a generator

// a generator interface is a lot more practical compared to iterator interface or function closure interface
function *something() {
  var nextVal;
  
  while(true) { // keep generating values forever, as long as we are asking for a value
    if (nextVal == undefined) {
      nextVal = 1;
    }
    else {
      nextVal = (3 * nextVal) + 6;
    }
    nextVal; //?
    yield nextVal;
  }
}

var it = something();
it.next(); //?
it.next(); //?
it.next(); //?
it.next(); //?

// IMPORTANT: in a generator, such a loop is generally totally OK if it has a yield in it, as the generator will pause at each iteration, yielding back to the main program and/or to the event loop queue.

// Because the generator pauses at each yield, the state (scope) of the function *something() is kept around, meaning there’s no need for the closure boilerplate to preserve variable state across calls.

// works identically with a for of loop
// We didn’t just reference something as a value like in earlier examples, 
// but instead called the *something() generator to get its iterator for the for..of loop to use.
for (var v of something() ) {
  console.log(v);
  if (v > 2000) {
    break;
    // return; // either works

    // hidden behavior: “Abnormal completion” (i.e., “early termination”) of the for..of loop — generally caused by a break, return, or an uncaught exception — 
    // ..sends a signal to the generator’s iterator for it to terminate.
  }
}
// something here is a generator, which is not an iterable. We have to call something() to construct a producer for the for..of loop to iterate over.
// The something() call produces an iterator, but the for..of loop wants an iterable? 
// The generator’s iterator also has a Symbol.iterator function on it, which basically does a return this, just like the something iterable we defined earlier.
// In other words, a generator’s iterator is also an iterable!
