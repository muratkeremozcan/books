// remember the callback example in 5.1_async-generators 
// what if we made the callback foo(..) in there into a promise?

// we could construct a promise with foo(..) and then yield it from the generator, 
// and then the iterator control code would receive that promise.
// the iterator then should listen for the promise to resolve (fulfillment or rejection), 
// and then either resume the generator with the fulfillment message or throw an error into the generator with the rejection reason.

// TL,DR; at the generator yield a Promise, and wire that Promise to control the generator’s iterator


// note: changed the original function to return a real promise
function foo(x, y) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(x + y);
      }, Math.random() * 1000);

      setTimeout(function () {
        reject('rejector kicked in');
      }, 200);

    });
}

// the generator code did not change
function* main() {
  try {
    // the yield here stops execution, calls foo.
    // foo returns a value with it.next(data), or throws an error. 
    // That data becomes the result of 'yield', gets assigned to text
    var text = yield foo(11, 31);
    console.log(text);
  }
  catch (err) {
    console.log(err);
  }
}

var it = main();

// (1) when starting the generator, promise foo(11, 31) is called / yielded.
var p = it.next().value; //?
// (2) what gets yielded is a promise (the code is similar to the callback in 5.1)
p.then(
  function onFulfilled(data) {
    data; //?
    // resume main with received data
    it.next(data); //?
  },
  function onRejected(err) { 
    err; //?
    // if the promise is rejected, throw the error to main and it gets caught there
    it.throw(err); //?
  }
)
