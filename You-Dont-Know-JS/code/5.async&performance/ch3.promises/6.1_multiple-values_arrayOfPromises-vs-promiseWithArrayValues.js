// Promises by definition only have a single fulfillment value or a single rejection reason.
// when multiple fulfillment values are needed,
// the typical advice is to construct a values wrapper (such as an object or array) to contain these multiple messages.

// it is preferred to wrap each value into its own promise and put them in an array||object, (letting the calling decide what to do with the promises)
  // then use one promise to transport the values in an array||object (hiding the abstraction)

function getY(x) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve((3 * x) - 1);
    }, 100);
  });
}

// foo is a utility that generates 2 asynchronous values
function foo(bar, baz) {
  var x = bar * baz;

  // here we wrap x and y into a single array value, to be transported through a promise
  return getY(x) //?
    .then(function (y) {
      x; //?
      y; //?
      return [x, y];
    });
}

// a Promise with 2 array values
foo(10,20) //?
  .then(
    function(msgs) {
      msgs[0]; //?
      msgs[1]; //?
    }
  )

///////

// Instead of a single array value transported through one promise, we can wrap each value into its own promise:

function foo_v2(bar,baz) {
  var x = bar * baz;

  // return both promises
  return [
    Promise.resolve(x),
    getY(x)
  ];
}

// an array that has 2 promises
foo_v2(10,20) //?

// unwrap with Promise.all
Promise.all(foo_v2(10, 20)).then(
  function(msgs) {
    msgs[0]; //?
    msgs[1]; //?
  }
)
// with destructuring
Promise.all(foo_v2(10, 20)).then(
  function([x, y]) {
    x; //?
    y; //?
  },
  // alternative
  // function(msgs) {
  //   var [x, y] = msgs;
  //   x; //?
  //   y; //?
  // } 
)
// this approach more closely embraces the Promise design theory. 
// rather than to abstract such details away inside of foo(..)
// we let the calling code decide how to orchestrate the two promises 