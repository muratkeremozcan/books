// arrow-functions adopt the this binding from the enclosing (function or global) scope.

function foo() {
  return (a) => {
    // this here refers to foo()
    return console.log(this.a);
  };
}

var obj1 = {a:1};
var obj2 = {a:2};

// The arrow-function created in foo() lexically captures whatever foo()s this is at its call-time
// since foo is bound to obj2, bar is also bound to obj2
// the lexical binding of an arrow function cannot be overridden

var bar = foo.call(obj2);
bar(); // 2

bar.call(obj1); // still 2

