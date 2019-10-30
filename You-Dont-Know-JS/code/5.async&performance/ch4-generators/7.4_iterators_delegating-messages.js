// yield-delegation doesn’t even have to be directed to another generator;
//  it can just be directed to a non-generator, general iterable.

function *bar() {
  console.log('inside *bar() :', yield 'A');

  // yield delegation to a non-generator
  console.log('inside *bar() :', yield *['B', 'C', 'D']);
  // the default array iterator doesn’t care about any messages sent in via next(..) calls, so the values 2, 3, and 4 are essentially ignored.
  // Also, because that iterator has no explicit return value (unlike the previously used *foo()), the yield * expression gets an undefined when it finishes
  
  console.log('inside *bar() :', yield 'E');

  return 'F';
}

var it = bar();

console.log('outside ', it.next().value);
console.log('outside ', it.next(1).value);
console.log('outside ', it.next(2).value);
console.log('outside ', it.next(3).value);
console.log('outside ', it.next(4).value);
console.log('outside ', it.next(5).value);