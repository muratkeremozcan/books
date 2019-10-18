// Lexical scope holds that the RHS reference to a in foo() will be resolved to the global variable a, 
  // which will result in value 2 being output. 

// Dynamic scope, by contrast, doesn’t concern itself with how and where functions and scopes are declared,
  // but rather where they are called from. In other words, the scope chain is based on the call-stack, not the nesting of scopes in code.

function foo() {
  // looks lexical to me, because it returns 2
  // dynamic would return 3 because at call site bar, a = 3
  console.log(a); 
}

function bar() {
  var a = 3;
  foo();
}

var a = 2;

bar();
