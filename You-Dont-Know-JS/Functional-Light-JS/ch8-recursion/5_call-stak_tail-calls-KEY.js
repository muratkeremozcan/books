{ // the concept of call stack

  function foo() {
    var z = 'foo';
  }

  function bar() {
    var y = 'bar';
    foo();
  }

  function baz() {
    var x = 'baz';
    bar();
  }

  baz();
}

// call stack frames look as such:
/*
                foo()

        bar()   bar()

baz()   baz()   baz()
*/

// If these functions didn’t call each other, but were just called sequentially – like baz(); bar(); foo();,
// where each one finishes before the next one starts – the frames won’t stack up; 
// each function call finishes and removes its frame from the stack before the next one is added.


// the concept of tail call:
// if a call from function baz() to function bar() happens at the very end of function baz()’ s execution – referred to as a tail call
// the stack frame for baz() isn’t needed anymore.
// That means that either the memory can be reclaimed, or even better, simply reused to handle function bar()’ s execution.
// tail call looks as such:
/*
                foo()

        bar()   

baz()   
*/

// ES6 mandates recognition of tail calls, of a specific form referred to as Proper Tail Calls (PTC),
//  and the guarantee that code in PTC form will run without unbounded stack memory growth.
{ // the concept proper tail call: the function call is the last thing to execute in the surrounding function, 
  // and whatever value it returns is explicitly returned.
  // In this way, JS can be absolutely guaranteed that the current stack frame won’t be needed anymore.

  function foo() {
    var z = 'foo';
    return z;
  }

  function bar() {
    var y = 'bar';
    return foo();
  }

  function baz() {
    var x = 'baz';
    return bar();
  }

  baz(); //?
}


/*
proper PTC:  

return foo( .. );

return x ? foo() : bar();


not proper PTC: 

foo(); 
return; 

// A JS engine, or a smart transpiler, could do some code reorganization to treat this one the same as return foo();  but it's not required by the spec
var x = foo( .. ); 
return x; 

return 1 + foo( .. );


Binary (or multiple) recursion – as shown earlier, two (or more!) recursive calls made at each level – can never be fully PTC as-is, 
because all the recursion has to be in tail call position to avoid the stack growth; at most, only one recursive call can appear in PTC position.

*/ 