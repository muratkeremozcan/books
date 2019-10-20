// sometimes you want to respond only to the “first Promise to cross the finish line,” letting the other Promises fall away.
// This pattern is classically called a latch, but in Promises it’s called a race.

// Promise.race([ .. ]) also expects a single array argument, containing one or more Promises, thenables, or immediate values.
// It doesn’t make much practical sense to have a race with immediate values

// A race requires at least one “runner,” so if you pass an empty array, 
// instead of immediately resolving, the main race([..]) Promise will never resolve.

// Because only one promise wins, the fulfillment value is a single message, not an array as it was for Promise.all([ .. ]).

var p1 = request('http://some.url.1/');
var p2 = request('http://some.url.2/');

Promise.race([p1, p2])
  .then(function (msg) {
    // either p1 or p2 will win
    return request(
      "http://some.url.3/?v=" + msg
    );
  })
  .then(function (msg) {
    console.log(msg);
  })