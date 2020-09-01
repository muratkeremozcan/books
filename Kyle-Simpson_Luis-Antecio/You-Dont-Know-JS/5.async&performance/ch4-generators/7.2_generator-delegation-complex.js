import run from './generator-runner';

function samplePromise(x, y) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(x + y);
      }, Math.random() * 1000);

      // setTimeout(function () {
      //   reject('rejector kicked in');
      // }, 600);

    });
}

function *foo() {
  var r2 = yield samplePromise(1, 2); //?
  var r3 = (yield samplePromise(5, 6)) + r2; //?
  
  return r3; //?
  // As soon as the it iterator control exhausts the entire *foo() iterator, it automatically returns to controlling *bar().
}

function *bar() {
  var r1 = yield samplePromise(10, 18); //?

  // delegating to *foo() via yield
  // yield *foo() eliminates the need for a subinstance of the run(..) utility ( like run(foo) ).
  // in the run(foo) version of this example, the Promise mechanism (controlled by run(..)) 
  // was used to transport the value from return r3 in *foo() to the local variable r3 inside *bar().
  //  Now, that value is just returned back directly via the yield * mechanics.

  // var r3 = run(foo); //?
  var r3 = yield *foo(); //?
  console.log(r1 + r3);
}

run(bar);