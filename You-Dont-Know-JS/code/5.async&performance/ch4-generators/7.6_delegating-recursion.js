// You could even use yield-delegation for async-capable generator recursion
// — a generator yield-delegating to itself:

import run from './generator-runner';

function samplePromise(x) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(x);
      }, Math.random() * 1000);

      // setTimeout(function () {
      //   reject('rejector kicked in');
      // }, 600);

    });
}

// recursion with generator
function *foo(val) {
  if (val > 1) {
    val; //?
    // (3) 3 > 1, foo(2) creates another iterator, passes in 2 for val
    // (4) 2> 1, foo(1) creates another iterator, passes in 1 for val
    val = yield *foo(val-1);
  }
  val;
  // (5)  1 > 1 is false, we call the promise, get 1
  return yield  samplePromise(val); //?
}

function *bar() {
  // (2) bar delegates to *foo: *foo(3) creates an iterator for *foo() and passes 3 as its val parameter
  var r1 = yield *foo(3); //?
  console.log(r1);
}

// (1) start the generator
run(bar);

// run utility supports additional arguments. We do not need a 2nd generator to recurse
// run (foo, 3); 