function *foo() {
  console.log('inside foo() :', yield 'B');
  console.log('inside foo() :', yield 'C');

  return 'D';
}

function *bar() {
  console.log('inside bar() :', yield 'A');
  // yield delegation
  console.log('inside bar() :', yield *foo() );
  console.log('inside bar() :', yield 'E');

  return 'F';
}

var it = bar(); //?

// KEY: first the iteration happens, then the value is passed to the previous yield

// start the generator *bar()
console.log('outside', it.next().value);
// passing message to the generator *bar() , yielding B from delegate foo
console.log('outside', it.next(1).value);
// passing message to the delegate, yielding C from the next yield
console.log('outside', it.next(2).value);
// as soon as we call next, the delegate *foo() finishes running, returns D to *bar(), 
// IMPORTANT:  this value doesn’t get returned all the way back to the outside it.next(3) call.
// *bar() moves to the next step and yields E
console.log('outside', it.next(3).value);
// *bar() finishes and returns F
console.log('outside', it.next(4).value);


// Pay particular attention to the processing steps after the it.next(3) call: 
// The 3 value is passed (through the yield-delegation in *bar()) into the waiting yield "C" expression inside of *foo().  
// *foo() then calls return "D", but this value doesn’t get returned all the way back to the outside it.next(3) call.  
// Instead, the "D" value is sent as the result of the waiting yield *foo() expression inside of *bar() 
// — this yield-delegation expression has essentially been paused while all of *foo() was exhausted. 
// So "D" ends up inside of *bar() for it to print out.  
// yield "E" is called inside of *bar(), and the "E" value is yielded to the outside as the result of the it.next(3) call.
