function *foo() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

function *bar() {
  var x = yield *foo();
  // 1, 2, and 3 values are yielded out of *foo() and then out of *bar(), 
  // the 4 value returned from *foo() is the completion value of the yield *foo() expression, which then gets assigned to x.
  console.log('x:', x);
}

for (var v of bar()) {
  console.log(v);
}