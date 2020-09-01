// when there is a return in the try block, and there is a finally block, who runs first?

// The return 42 runs right away, which sets up the completion value from the foo() call. 
// This action completes the try clause and the finally clause immediately runs next. 
// Only then is the foo() function complete, so that its completion value is returned back for the console.log(..) statement to use.

function foo() {
  try {
    console.log('runs first');
    return 42; // runs 0
  }
  finally {
    console.log('runs later');
  }
  console.log('never runs');
}

console.log(foo());


// same thing for throw inside a try

function foob() {
  'use strict';
  try {
    throw 42; // runs 0
  }
  finally {
    console.log("2nd");
  }
  console.log('never runs');
}

console.log( foob() );



function bar() {
  try {
     return 42;
  }
  finally {
     throw "Oops!";
  }

  console.log( "never runs" );
}

console.log( bar() );

// A return inside a finally has the special ability to override a previous return from the try or catch clause, but only if return is explicitly called
