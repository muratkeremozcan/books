// 2 deficiencies with callbacks: lack of sequentiality and inversion of control
// What if, instead of handing the continuation of our program to another party, 
// we could expect it to return us a capability to know when its task finishes, and then our code could decide what to do next? 
  // This paradigm is called Promises.

// example: Promise.all([..])
function add(xPromise, yPromise) {
  // `Promise.all([ .. ])` takes an array of promises,
  // and returns a new promise that waits on them all to finish
  return Promise.all([xPromise, yPromise])

    // when that promise is resolved, let's take the
    // received `X` and `Y` values and add them together.
    .then(function (values) {
      // `values` is an array of the messages from the
      // previously resolved promises
      return values[0] + values[1];
    });
}
// With Promises, the then(..) call can actually take two functions, the first for fulfillment (as shown earlier), 
  // and the second for rejection:
add(fetchX(), fetchY()).then(
  function (sum) { // fulfillment handler
    console.log(sum);
  },
  function(err){ // error handler
    console.error(err);
  }
)
// the promise encapsulates the time-independent state, therefore from the outside it is time-independent.
  // It is also immutable once resolved.
  // With a fair amount of work, you could ad hoc create the same effects with nothing but ugly callback composition, 
  // but that’s not really an effective strategy, especially because you have to do it over and over again.
