// resolution of Promises to the problem of never calling a callback: 
  // we can ensure a signal as to the outcome of foo(), to prevent it from hanging our program indefinitely.

function foo() {
  return console.log('hello');
}

// a utility for timing out a Promise
function timeoutPromise(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject("Timeout!");
    }, delay);
  });
}

// setup a timeout for `foo()`
Promise.race([
  foo(),                  // attempt `foo()`
  timeoutPromise(3000)  // give it 3 seconds
])
  .then(
    function () {
      // `foo(..)` fulfilled in time!
      console.log('fulfilled in time!');
    },
    function (err) {
      // either `foo()` rejected, or it just
      // didn't finish in time, so inspect`err` to know which
      console.error(err);
    }
  );
