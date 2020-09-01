// In the same way that yield-delegation transparently passes messages through in both directions,
// errors/exceptions also pass in both directions:


function *foo() {
  try {
    yield 'B'; //?
  }
  catch (err) {
    console.log('error caught inside foo() :', err);
  }

  yield 'C'; //?

  throw 'D';
}

function *bar() {
  yield 'A'; //?

  try {
    yield *foo();
  }
  catch (err) {
    console.log('error caught inside bar() :', err);
  }

  yield 'E'; //?

  yield *baz();

  // can't get here
  yield 'G';
}

function *baz() {
  throw 'F';
}

var it = bar();

console.log('outside:', it.next().value);
// first the iterator proceeds, then the message is passed to the previous iterator
console.log('outside:', it.next(1).value);

console.log('outside:', it.next(2).value);
// throw instead of next(x) : the value gets passed to the catch in bar , instead of yield 'C' line in foo because *foo() is the delegate
console.log('outside', it.throw(3).value);

// as soon as we run this, baz() is delegated to, and baz throws back 'F'
try {
  console.log( "outside:", it.next( 4 ).value );
}
catch (err) {
  console.log( "error caught outside:", err );
}
