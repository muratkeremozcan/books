// how does a function behave when it’s inside another function’s scope? 
// When the inner function makes reference to a variable from the outer function, this is called closure.
// With Closure, a function remembers and accesses variables from outside of its own scope,
// even when that Closure is is executed in a different scope
{
  function foo(msg) {
    var fn = function inner() {
      // msg is referenced inside the inner function
      // When foo(..) is executed and the inner function is created, 
      // it captures the access to the msg variable, and retains that access even after being returned
      return msg.toUpperCase();
    }
    return fn;
  }

  // foo(..) has finished and it would seem as if its scope should have gone away, meaning the msg variable would no longer exist.
  // But that doesn’t happen, because the inner function has a closure over msg that keeps it alive
  // The closed over msg variable survives for as long as the inner function (now referenced by helloFn in a different scope) stays around.
  var helloFn = foo('Hello');
  helloFn(); //?
}

// other examples of closure
{
  function person (name) {
    // the inner function identify has a closure over name
    return function identify() {
      console.log(`I am ${name}`);
    }
  }

  var fred = person ('Fred');
  var susan = person ('Susan');

  fred();
  susan();
}


{ // access to closure is not just a snapshot but rather a live link.
  // You can update the value, and that new current state remains remembered until the next access
  function runningCounter(start) {
    var val = start; 
    val; //?

    return function current( increment = 1 ) {
      // val is remembered!
      increment; //?
      
      val = val + increment;
      val; //?
      return val;
    };
  }

  var score = runningCounter(0);
  score(); //? 
  score(); //?
  score(13); //?
  score(13); //?
}