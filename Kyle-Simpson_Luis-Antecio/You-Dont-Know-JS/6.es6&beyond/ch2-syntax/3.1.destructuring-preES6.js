// pre-ES6
//  Manually assigning indexed values from an array or properties from an object can be thought of as structured assignment.

function foo() {
  return [1, 2, 3];
}
function bar() {
  return {x: 4, y: 5, z: 6};
}

// arrays
var tmp = foo(),
a = tmp[0],
b = tmp[1],
c = tmp[2]

a;
b;
c;


// objects
var temp = bar(),
k = temp.x, 
l = temp.y,
m = temp.z;

k;
l;
m;