var a;

// problem: either function not resolved, we want 1st one to win
// function foo(x) {
//     a = x * 2;
//     baz();
// }

// function bar(x) {
//     a = x / 2;
//     baz();
// }

// function baz() {
//     console.log( a );
// }

// solution: latch: the first one wins
function bar(x) {
  if (!a) {
    a = x * 2;
    baz();
  }
}

function foo(x) {
  if (!a) {
    a = x / 2;
    baz();
  }
}

function baz() {
  console.log(a);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
