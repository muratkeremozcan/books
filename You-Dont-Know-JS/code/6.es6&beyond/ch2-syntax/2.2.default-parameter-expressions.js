// default parameters do not have to be only values. They can be expressions or function calls too

function bar(val) {
  console.log('bar called!');
  return y + val;
}

function foo(x = y + 3, z = bar(x) ) {
  x;
  return {x, z};
}

let y = 5;

foo(); //?
// the default value expression is only run if needed (lazily evaluated)
foo(10); //?
foo(undefined, 10); //?