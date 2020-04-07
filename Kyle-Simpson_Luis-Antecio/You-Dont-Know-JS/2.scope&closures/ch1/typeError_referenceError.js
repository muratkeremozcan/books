// a = 2, a?, b?, a? , b = a, foo(2)?, c = foo(2) 

function foo(a) {
  // b is undeclared, b? RHS look up can't find it
  // if b? / RHS fails to find b anywhere in the scopes, this results in a Reference error
  console.log(a + b);
  b = a;
}
var c = foo(2);

var b; // you can comment out this line to produce Reference error

// ReferenceError is scope resolution-failure related, 
// whereas TypeError implies that scope resolution was successful, but that there was an illegal/impossible action attempted against the result.

// Unfulfilled RHS references result in ReferenceErrors being thrown. 
// Unfulfilled LHS references result in an automatic, implicitly created global of that name (if not in Strict Mode), or a ReferenceError (if in Strict Mode).

var num = 1;
try {
  num.toUpperCase();
  num.getElementById("demo")
}
catch (err) {
  num.getElementById("demo").innerHTML = err.name;
}