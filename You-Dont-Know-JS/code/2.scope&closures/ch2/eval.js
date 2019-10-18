function foo(str, a) {
  // "use strict"; // if strict mode is used, declarations inside of eval() do not modify the enclosing scope
  eval(str); // cheating!  executes var b = 3
  console.log(a, b);
}

var b = 2;

foo("var b = 3;", 1); // 1, 3 The string "var b = 3;" is treated,
