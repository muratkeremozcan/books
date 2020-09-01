// generators have an input/output messaging capability built into them, via yield and next(..)
// In general, you’re going to have one more next(..) call than you have yield statements
// the first next() is used to start the generator
// the second next() call fulfills the first paused yield expression
// the third next() call fulfills the second paused yield expression and so on

function* foo(x) {
  // requests the calling code to provide a value for the yield expression. only the next(<value>) can provide an answer
  // yield always accepts a value from next, whether it is passing one back or not
  var y = x * (yield);
  return y;
}

var it = foo(6); //?

// start `foo(..)` with next(), then it runs into the 'yield' expression
// and essentially requests the calling code to provide a result value for the yield expression.
it.next(); //?

// you can force-skip passing in a value back to the generator
// it.next(); //? 

// or you can resume the generator and provide a value by calling next(..) with a value passed in
var res = it.next(7); //?
res.value; //?



