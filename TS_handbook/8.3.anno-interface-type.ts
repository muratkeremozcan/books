// optional variables with parameter annotation, converted to an interface

function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  }
  else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
padding(1); //?
padding(1,2); //?
padding(1,2,3,4); //?
padding(1,2,3); //?


/////////
// same example, using interface
interface PaddingVal {
  a: number;
  b?: number;
  c?: number;
  d?: number;
}

function padding_with_I(mySides: PaddingVal) {
  if (mySides.b === undefined && mySides.c === undefined && mySides.d === undefined) {
    mySides.b = mySides.c = mySides.d = mySides.a;
  }
  else if (mySides.c === undefined && mySides.d === undefined) {
    mySides.c = mySides.a;
    mySides.d = mySides.b;
  }
  return {
    top: mySides.a,
    right: mySides.b,
    bottom: mySides.c,
    left: mySides.d
  };
}

// toggle properties for comparable results
let myPadding = {
  a: 1,
  b: 2,
  // c: 3,
  // d: 4
}

padding_with_I(myPadding); //?

///////////
// same example using custom type / type alias

// tip: if you need to have hierarchies of Type annotations use an interface. They can be used with implements and extends
// tip: Use a type alias for simpler object structures (like Coordinates) just to give them a semantic name. 
// Also when you want to give semantic names to Union or Intersection types, a Type alias is the way to go.

type PaddingValues = {
  a: number;
  b: number;
  c?: number;
  d?: number;
}

function padding_with_T(mySides: PaddingValues) {
  if (mySides.b === undefined && mySides.c === undefined && mySides.d === undefined) {
    mySides.b = mySides.c = mySides.d = mySides.a;
  }
  else if (mySides.c === undefined && mySides.d === undefined) {
    mySides.c = mySides.a;
    mySides.d = mySides.b;
  }
  return {
    top: mySides.a,
    right: mySides.b,
    bottom: mySides.c,
    left: mySides.d
  };
}

// toggle properties for comparable results
let myPaddingTypes = {
  a: 1,
  b: 2,
  // c: 3,
  // d: 4
}

padding_with_T(myPaddingTypes); //?
