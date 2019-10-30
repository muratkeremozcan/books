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
console.log('outside:', it.next().value);

// throw instead of next(x) : the value gets passed to the catch instead of yield 'B' line
// console.log('outside:', it.next(2).value);
console.log('outside', it.throw(2).value);

// pass 3 to line yield 'C' , but then that throw throws it to bar, because *foo() is the delegate
console.log('outside:', it.next(3).value);

// as soon as we run this, baz() is delegated to, and baz throws back 'F'
try {
  console.log( "outside:", it.next( 4 ).value );
}
catch (err) {
  console.log( "error caught outside:", err );
}
