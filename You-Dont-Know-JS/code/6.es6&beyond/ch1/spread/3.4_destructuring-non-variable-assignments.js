// the assignment expressions (a, y, etc.) don’t actually need to be just variable identifiers. 
// Anything that’s a valid assignment expression is allowed.


var o = {};

function foo() {
  return [1, 2, 3];
}
function bar() {
  return { x: 4, y: 5, z: 6 };
}

[o.a, o.b, o.c] = foo();
o.a; //?
o.b; //?
o.c; //?

({ x: o.x, y: o.y, z: o.z } = bar());
o.x; //?
o.y; //?
o.z; //?


// you can even use computed property expressions
var which = 'x', // only x will work!
  o = {};

// The [which]: part is the computed property, (it is just a normal object key reference, instead of doing it with dot reference)
// which results in x — the property to destructure  from the object in question as the source of the assignment.

({ [which]: o[which] } = bar());
o.x; //?
