var anotherObject = {
  a: 2
};

// with Object.create , myObject is prototype-chain-linked to the prototype object (anotherObject)
// The property access process continues until either a matching property name is found up in the prototype chain, or the [[Prototype]] chain ends. 
// If no matching property is ever found by the end of the chain, the return result from the [[Get]] operation is undefined.
// The top end of every normal [[Prototype]] chain is the built-in Object.prototype.

var myObject = Object.create(anotherObject);

// for in loops work the same way with property access chain
for (var k in myObject) {
  console.log('found ' + k);
}

// the 'in' operator works the same way as well, dot operator, and hasOwnProperty also
('a' in myObject); //?
anotherObject.a; //?
anotherObject.hasOwnProperty('a'); //?

// shadowing: a does not exist in myObject, so it gets shadowed
myObject.a; //? 
// hasOwnProperty is false with Object.create, because it instead uses the prototype chain to get the value of a
myObject.hasOwnProperty('a'); //?
// Object.create prototype links the new object to the original object
Object.getPrototypeOf(myObject); //?

// oops! implicit shadowing
  // The result is [[Get]] looking up a property via [[Prototype]] to get the current value 2 from anotherObject.a,
  // incrementing the value by one, then [[Put]] assigning the 3 value to a new shadowed property a on myObject. Oops!
++myObject.a; //?
anotherObject.a; //?
myObject.hasOwnProperty('a'); //?



// contrast with Object.assign: hasOwnProperty returns true with Object.assign  (used for duplication)

var thirdObject = Object.assign({}, anotherObject);

for (let k in thirdObject) {
  console.log('found ' + k);
}
('a' in thirdObject); //?

thirdObject.a; //?
thirdObject.hasOwnProperty('a'); //?
// Object.assign does not prototype link
Object.getPrototypeOf(thirdObject); //?
// and also works in the ++ operator situation
++thirdObject.a; //?
thirdObject.a; //?