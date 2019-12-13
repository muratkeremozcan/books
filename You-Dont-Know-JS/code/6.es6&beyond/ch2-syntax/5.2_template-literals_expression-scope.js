// an interpolated string literal is kind of like an IIFE,
// just lexically scoped where it appears, not dynamically scoped in any way

function bar() {
  var name = 'bar'; // name here is in the scope of bar()
  foo(`Hello from ${name}`);
}

function foo(str) {
  var name = 'foo';
  // when called from foo, the scope is still at bar()!!
  console.log(str);
}
// neither foo's name or global scope's name matters
var name = 'global';


bar(); //?