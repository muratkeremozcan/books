// Lexical scope holds that the RHS reference to a in foo() will be resolved to the global variable a, 
  // which will result in value 2 being output. 

// Dynamic scope, by contrast, doesn’t concern itself with how and where functions and scopes are declared,
  // but rather where they are called from. In other words, the scope chain is based on the call-stack, not the nesting of scopes in code.


var a = 2;

// why not dynamic?? usually this should be 3, but we have strict mode
// what should happen is : When foo() cannot resolve the variable reference for a, 
// instead of stepping up the nested (lexical scope ) scope chain, 
// it walks up the call-stack, to find where foo() was called from. 
// Since foo() was called from bar() it checks the variables in scope for bar(), and finds an a there with value 3

function foo() {
  // looks lexical to me, because it returns 2
  // dynamic would return 3 because at call site bar, a = 3
  // may be because of strict mode
  console.log(a); 
}

function bar() {
  var a = 3;
  foo();
}

bar();


// for sure lexical with arrow functions
const lex_foo = () => {
  console.log(a);
}

const lex_bar = () => {
  var a = 3;
  lex_foo();
}

lex_bar();