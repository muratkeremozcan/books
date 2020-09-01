var a, b;

// problem: either of the concurrent function calls have not been resolved, by the time the other is called 
// function foo(x) {
//     a = x * 2;
//     baz();
// }

// function bar(y) {
//     b = y * 2;
//     baz();
// }

// function baz() {
//     console.log(a + b);
// }

// solution: use a gate to make sure both values are truthy : if(a && b)
function foo(x) {
  a = x * 2;
  if (a && b) {
      baz();
  }
}

function bar(y) {
  b = y * 2;
  if (a && b) {
      baz();
  }
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", foo );
ajax( "http://some.url.2", bar );
