// The variables can already be declared, and then the destructuring only does assignments, 

let a, b, c, x, y, z;

function foo() {
  return [1, 2, 3];
}
function bar() {
  return { x: 4, y: 5, z: 6 };
}

[a, b, c] = foo(); //?
a;
b;
c;

// IMPORTANT: must surround in ( .. ) because otherwise {  } of the object is taken as a function block
({ x, y, z } = bar()); //?
x;
y;
z;

