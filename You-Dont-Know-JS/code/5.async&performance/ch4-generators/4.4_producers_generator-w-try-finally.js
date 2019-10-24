// “Abnormal completion” (i.e., “early termination”) of the for..of loop — generally caused by a break, return, or an uncaught exception —
// ..sends a signal to the generator’s iterator for it to terminate.
// While a for..of loop will automatically send this signal, you may wish to send the signal manually to an iterator; 
// you do this by calling return(..).

// If you specify a try..finally clause inside the generator, it will always be run even when the generator is externally completed. 
// This is useful if you need to clean up resources (database connections, etc.)

function* something() {
  try {
    var nextVal;

    while (true) {
      if (nextVal === undefined) {
        nextVal = 1;
      }
      else {
        nextVal = (3 * nextVal) + 6;
      }

      yield nextVal;
    }
  }
  // cleanup clause
  finally {
    console.log('cleaning up');
  }
}

var it = something();

for (var v of it) {
  if (v > 2000) {
    console.log(
      // When we call it.return(..), it immediately terminates the generator, which of course runs the finally clause.
      // Also, it sets the returned value to whatever you passed in to return(..), which is how "Hello World" comes right back out.
      // also the iterator is set to done:true

      it.return('Hello World').value
      );
    }
    console.log(v);
  // no break or return needed here
}