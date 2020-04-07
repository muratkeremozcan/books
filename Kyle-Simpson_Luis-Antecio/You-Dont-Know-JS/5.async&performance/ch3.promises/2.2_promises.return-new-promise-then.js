// then(..) registers "fulfillment" and/or "rejection" event(s), though we don’t see those terms used explicitly in the code.

// The pattern shown with new Promise( function(..){ .. } ) is generally called the revealing constructor. 
// The function passed in is executed immediately (not async deferred, as callbacks to then(..) are), 
// and it’s provided two parameters, which in this case we’ve named resolve and reject. 
// These are the resolution functions for the promise. resolve(..) generally signals fulfillment, and reject(..) signals rejection.

function foo(x) {
  // start doing something that could take a while

  // construct and return a promise
  return new Promise(function (resolve, reject) {
    // eventually, call `resolve(..)` or `reject(..)`,
    // which are the resolution callbacks for the promise
  });
}
var p = foo(42)
bar(p);
baz(p);

// In the first approach, bar(..) is called regardless of whether foo(..) succeeds or fails, 
  // and it handles its own fallback logic if it’s notified that foo(..) failed.
function bar(fooPromise) {
  // listen for `foo(..)` to complete
  fooPromise.then(
    function () {
      // foo has finished, do bar's task
    },
    function (err) {
      // oops, something went wrong in foo
    }
  );
}
// same for baz


// another way to do it
  // in this approach, bar is called only if foo succeeds
function bar() {
  // foo() has finished, do bar()'s task'
}
function oopsBar() {
  // something went wrong in foo() so bar() didn't return
}

var p = foo(42);
p.then(bar, oopsBar);
p.then(baz, oopsBaz);