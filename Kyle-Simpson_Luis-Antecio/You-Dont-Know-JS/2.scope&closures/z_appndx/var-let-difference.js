// differences between var and let 
// (1) var is function or global scoped. Let is block scoped denoted by { } 
// (2) var is hoisted and can be re-declared, let is not hoisted and cannot be re-declared 
// (3 not crazy important) var can declare a property on the global object, let cannot declare a property on the global object
// (4 not crazy important) for loops : use let

///// (1) function scoping: let and var work the same in a function block
function aSampleFunction() {
  function inner() {
    var varVariable = "Hey! How are you? I am var variable.";
    let letVariable = "Hey! What's up? I am let variable.";
    console.log(varVariable);
    console.log(letVariable);
  }
  return inner();
}
aSampleFunction();

// (1)  distinction: let is Block scoped, var is function scoped
function run() {

  var foo = "Foo"; 
  let bar = "Bar";
  console.log(foo, bar);

  {
    var baz = "Bazz"; // block scoping with let. If you change to var, it will work!
    console.log(baz);
  }
  console.log(baz); // !! ReferenceError !! . Enable line to reproduce
}
run();


///// (2) var is Hoisted, and can be re-declared
function hello() {
  console.log(x); 
  var x = 5; // x is hoisted to the top
  console.log(x);

  // console.log(y); // Error
  let y = 10;
  console.log(y);

  // let y = 20; // Error . Cannot redeclare let variables
  var x = 15; // Can redeclare var variables
} 
hello();


////// global scope
// (3) At the top level, unlike var, let does not create a property on the global object:

// var foo = "Foo";  // globally scoped
// let bar = "Bar"; // globally scoped

// console.log(window.foo); // Foo
// console.log(window.bar); // undefined


//////

// in for loops, use let . Look at ../requireJS_modules/loops.js example for why
// TL, DR; The let i in the for header declares an i not just for the for loop itself, but it re-declares a new i for each iteration of the loop.
//  That means that closures created inside the loop iteration close over those per-iteration variables the way you’d expect.





//////  one last gotcha:
// TL,DR; let must be in the beginning of a block

{
  // Accessing a let-declared variable earlier than its let .. declaration/initialization causes an error, 
  // whereas with var declarations the ordering doesn’t matter

  console.log(a);
  // console.log(b); // (2) will give RHS because of TDZ

  var a;
  let b; // (1) variable that’s not given an assignment at declaration time is assumed to have been assigned the undefined value, so let b; is the same as let b = undefined;.
  // TDZ happens when accessing a variable that's been declared but not yet initialized
}

// typeof behaves differently with Temporal Dead Zone (TDZ) variables
{
  // a is not initialized
  if (typeof a === 'undefined') {
    console.log('cool');
  }

  // b is declared but not initialized ( it is in TDZ )
  if (typeof b === 'undefined') {
    // ..
  }
  // change to var or remove let and it is ok
  let b;
}
