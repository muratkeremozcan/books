// pre es6

function foo( x, y) { 
  // (1) problem: gotcha with falsy values: 0 and null do not act like 0
  x = x || 11; 
  y = y || 31; 

  // workaround to the gotcha 
  // x = (x !== undefined) ? x : 11;
  // y = (y !== undefined) ? y : 31;

  return ( x + y );
}
foo(); //?
foo(5, 6); //?
foo(5); //?

// (1) gotcha if you need to be able to pass in what would otherwise be considered a falsy value for one of the parameters
// you want null and 0 to act like 0, undefined to act like missing. With (1) they all act like missing.
// with the workaround, 0 and null coerce to 0 and act like 0.

foo(42, 0); //?
foo(42, null); //?
foo(42, undefined); //?

foo (0, 42); //?
foo(null, 42); //?
foo (undefined, 42); //?

// TL, DR;
// ES6 syntax addresses the above, acts like the x = (x !== undefined) ? x : 11 syntax
function bar(x = 11, y = 31) {
  return (x + y);
}

bar(); //?
bar(5, 6); //?
bar(5); //?

// null coerces to 0, undefined to missing

bar(42, 0); //?
bar(42, null); //?
bar(42, undefined); //?

bar(0, 42); //?
bar(null, 42); //?
bar(undefined, 42); //?