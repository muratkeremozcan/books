// Certain APIs don’t let you pass a value directly into a method, but require you to pass in a function,
// even if that function literally just returns the value. One such API is the then(..) method on JS Promises:
// may run into it with TypeScript, promise requiring to pass in a function and not accepting a value to be passed directly


function makePromise(val) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(val);
    }, Math.random() * 1000);
    setTimeout(function () {
      reject('rejected!');
    }, Math.random() * 3000);
  });
}

function foo() {
  return 'Hello foo'
} 
function bar() {
  return 'Hello bar'
} 

const p1 = makePromise('I have resolved p1');
const p2 = makePromise('I have resolved p2');

p1.then( foo ); //?

// the example claims it does not work, but it does (may be true for JS but not TS)
p1.then(foo)
  .then(p2)
  .then(bar); //?

// the example instead says the promise API requires to take a function instead of a value (most likely true for TS)
p1.then(foo)
  .then(function() { 
    return p2; 
  })
  .then(bar); //?

// generic solution is an arrow function
p1.then(foo)
  .then( () => p2 )
  .then(bar); //?

// the goal of the example is an FP utility
function constant(v) {
  return function value() {
    return v;
  }
}
var constantArrow = v => () => v;

p1.then(foo)
  .then(constant(p2))
  .then(bar); //?