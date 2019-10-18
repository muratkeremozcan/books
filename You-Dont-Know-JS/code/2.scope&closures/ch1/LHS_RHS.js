// LHS,   RHS,  LHS,   RHS, RHS, RHS,    LHS: 
// a = 2, a?,   b = a, b?,  a?, foo(2)?, c = foo(2)

function foo(a) {
  var b = a;
  return a + b;
}

var c = foo(2);
