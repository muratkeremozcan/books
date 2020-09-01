// a generator is a special kind of function that can start and stop
// one or more times, and doesn’t necessarily ever have to finish.


var x = 1;

// the generator
function *foo() {
  x++;
  yield; // pause!
  console.log( "x:", x );
}

function bar() {
  x++;
}

// construct an iterator `it` to control the generator
var it = foo(); // does not execute the generator yet

// start `foo()` here!
it.next(); // stops foo() at yield, foo() is still running but paused
x;   
bar(); // increments x
x; //?
it.next(); // resumes the execution of generator foo, and finalizes function execution


