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
    let baz = "Bazz"; // block scoping with let. If you change to var, it will work!
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

// in for loops, use let . Look at ./loops example for why
