function *foo() {
  try {
    // (1) value 1 is send back to it.next()
    yield 1;
  }
  catch (err) {
    // (2) throw('e1') comes here and is yielded
    console.log(err);
  }
  // (2) value 2 is sent back
  yield 2;
  // (3) next is called, throw is sent back
  throw 'foo: e2';
}

function *bar() {
  try {
    // (1) delegate to foo
    yield *foo();
    console.log('never gets here');
  }
  catch (err) {
    // (3) throw from *foo goes to bar
    console.log(err);
  }
}

var it = bar();

try {
  // (1) we ask for value
  it.next(); //?
  // (2) errors can propagate in both directions
  it.throw('e1'); //?
  // (3) throw from *foo goes to bar
  it.next(); //?
}
catch (err) {
  console.log(err);
}