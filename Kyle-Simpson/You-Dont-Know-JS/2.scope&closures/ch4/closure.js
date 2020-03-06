// Closure is when a function is able to remember and access its lexical scope 
  // even when that function is executing outside its lexical scope.

function foo() {
  var a = 2;

  function bar() {
    return a //?
  }

  return bar;
}

var baz = foo();

// closure lets the function bar() to continue to access the lexical scope it was defined in
baz(); //?
