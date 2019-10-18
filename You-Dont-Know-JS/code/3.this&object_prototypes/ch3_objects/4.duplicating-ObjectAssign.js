
// One subset solution is that objects that are JSON-safe 
  // (that is, can be serialized to a JSON string and then re-parsed to an object with the same structure and values) 
  // can easily be duplicated with:
var object = {
  a: 2
};
// works for trivial situations
var dupeObject = JSON.parse(JSON.stringify(object)); //?
// ES6 gives us Object.assign
  // takes a target object as its first parameter, and one or more source object(s) as its subsequent parameters. 
  // It iterates over all the enumerable, owned keys on the source object(s) and copies them (via = assignment only) to the target
var dupeObject2 = Object.assign({}, object); //?

////
// why can JSON parse JSON stringify be unsafe? Because of the circulation problem.

function anotherFunction() { /*..*/ }

var anotherObject = {
    c: true
};

var anotherArray = [];

var myObject = {
    a: 2,
    b: anotherObject, // reference, not a copy!
    c: anotherArray, // another reference!
    d: anotherFunction
};

// infinite circulation problem 
anotherArray.push( anotherObject, myObject );
myObject

// objects are Json safe, but you still get converting circular structure to Json error
// var newObj = JSON.parse(JSON.stringify(myObject));

// ultimately ES6 has defined Object.assign() 
var newObj = Object.assign( {}, myObject );
newObj//?
newObj.a; //?
newObj.b === anotherObject; //?
newObj.c === anotherArray; //?
newObj.d === anotherFunction; //?