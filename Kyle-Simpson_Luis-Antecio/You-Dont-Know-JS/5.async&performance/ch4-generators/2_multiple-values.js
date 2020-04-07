// each time you construct an iterator, you are implicitly constructing an instance of the generator which that iterator will control.
// multiple iterator instances of the same generator can run at the same time

// TL, DR; Key idea:  
// at first it.next() starts a generator . If the iterator is passing a value here, it means nothing
// the generator stops at the first yield. Optionally, If there is an expression in front of it, it yields that <value> to the iterator
// later when there is another iterator next() call, regardless of the expression in front of the yield, the yield gets its value from what the iterator passes it with  it.next()

function* foo() {
  var x = yield 2;
  x; //?
  z++;
  (x * z); //?
  var y = yield (x * z);
  y; //?
  console.log(x, y, z);
}

var z = 1;

var it1 = foo();
var it2 = foo();

// these stop at the first yield statement, yielding 2
// the behavior of the generator is to always yield first, then wait for the value coming in from next(..)
var val1 = it1.next().value //?
var val2 = it2.next().value //?
// at this state, no value from the iterators came yet

// IMPORTANT: mind how 'yield 2' is only for passing a value to the iterator, NOT for passing that value to the next line
// IMPORTANT: the result of the yield expression fully depends on what is coming from the iterator, which is 20 and 200
// we pass 20 (2 * 10) to the first yield, it advances to the next yield, AlREADY passing us (x*z), which is 40
// the generator passing the value of the expression in front of it first, then waits
val1 = it1.next(val2 * 10).value //?
// we pass 200 (40 * 5)to the first yield, it advances to next yield, ALREADY passing us (x*z), which is 600
// notice how the 2 iterators can work independent of each other
val2 = it2.next(val1 * 5).value //?

// with these we pass values back again, and advance to the conclusion. 300 (600 / 2) and 10 (40 / 4) respectively
// we pass 300 to generator
it1.next(val2 / 2); //?
// we pass 10 to generator
it2.next(val1 / 4); //?
// No value is passed back to the iterators here from the generator because there is no  yield <value> expression or return, so these iterators have value:undefined
// and they are done because we reached the end