// LHS, RHS, RHS, LHS :  a = 2, a? , b? , b = 2

function foo(a) {
  // is b here? nope, go up a floor to global scope and get it there
  console.log(a + b);
}

var b = 2;

foo(2); // 4

