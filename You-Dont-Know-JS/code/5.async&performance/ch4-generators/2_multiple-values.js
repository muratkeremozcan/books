// each time you construct an iterator, you are implicitly constructing an instance of the generator which that iterator will control.
// multiple iterator instances of the same generator can run at the same time


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
var val1 = it1.next().value //?
var val2 = it2.next().value //?

// with these we pass values back to the generator, advance it to the next yield and get a value back
val1 = it1.next(val2 * 10).value //?
val2 = it2.next(val1 * 5).value //?

// with these we pass values back again, and advance to the conclusion
it1.next(val2 / 2); //?
it2.next(val1 / 4); //?