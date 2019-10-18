

var a = 2;

// we can wrap a function around any code and hide the scope
function foo() { // <-- insert this

  var a = 3;
  console.log(a); // 3

} // <-- and this
foo(); // <-- and this

console.log(a); // 2

// 2 problems with the above: 
  // have to create named function 'foo' which pollutes the enclosing scope (global in this case)
  // have to call the function

  // IIFEs are the solution: do not need a name, can execute right away

var a = 2;

// we can wrap a function around any code and hide the scope
(function foo() { // <-- insert this . You only need to name the function in case you are using recursion

  var a = 3;
  console.log(a); // 3

})(); // <-- and this

console.log(a); // 2