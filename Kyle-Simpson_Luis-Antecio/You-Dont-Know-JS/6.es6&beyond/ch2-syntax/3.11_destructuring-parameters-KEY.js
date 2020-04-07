// function parameter/argument pairing is an assignment, so it can be destructured


// with an array
function foo([x, y]) {
  return [x, y];
}
foo([1, 2]); //?
foo([1]); //?
foo([, 2]); //?
foo([]); //?


// with an object (remember when destructuring, property name has to match!)
// IMPORTANT; the properties on the object map to the destructured parameters of the same names
// That also means that we get optional parameters (in any position) for free
function bar({ x, y }) {
  return [x, y];
}
bar({ x: 1, y: 2 }); //?
bar({ x: 15 }); //?
bar({ y: 42 }); //?
bar({}); //?

///////

// other capabilities when destructuring parameters

{  // with default parameters (2.1 - 2.3):
  function f1([x = 2, y = 3, z]) {
    return [x, y, z];
  }
  f1([, , 4]); //?
  f1([7, , 15]); //?
}

{ // with rest and spread operators (1.1 - 1.2):
  function f2([x, y, ...z], ...w) { // here it is rest (gathering parameters)
    return [[x, y, ...z], w]; // here it is spread (spreading the values out with concat)
    // can further spread by adding ... before [x,y, ...z] and w in the return
  }
  // here, spread too (function call)
  f2([1, 2, 3, 4, 5, 6, 7], 35, 45, 55); //?
}

{ // with repeated assignments (3.6)
  function f4( {x: X, y = 20 } ) {
    return { x: X, y };
   }
  f4( { x: 5 }); //?
}

{ // TL, DR; destructuring default value is more desirable vs destructuring a function parameter default value
  function f6( { x = 10 } = {}, { y } = { y: 10 }) {
    return [x, y];
  }
  f6(); //?
  // IMPORTANT:
  // good: named parameter x is defaulting to 10 if not passed as a property of that same name in the first argument’s object.
  // careful: The { y: 10 } value is an object as a function parameter default value, not a destructuring default value. 
    // As such, it only applies if the second argument is not passed at all, or is passed as undefined.

  // good:
  f6 ( {}, undefined ); //?
  f6 ( {} ); //?
  f6 ( undefined, undefined ); //?
  
  // careful:
  f6( {}, {} ); //?
  f6 ( undefined, {}); //?

  // happy:
  f6 ( {x: 2 }, { y: 3} ); //?
}