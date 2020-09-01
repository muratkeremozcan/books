var myObject = {};

Object.defineProperty(myObject, 'a', { // make 'a' enumerable
  enumerable: true,
  value: 2
});

Object.defineProperty(myObject, 'b', { // make 'b' non-enumerable
  enumerable: false,
  value: 3
});

// b exists, has an accessible value
myObject.b; //?
('b' in myObject); //?
myObject.hasOwnProperty('b'); //?
Object.prototype.hasOwnProperty.call(myObject, 'b'); //? 

// however, only a is enumerable, you only get key value for a
// The for in loop iterates over the list of enumerable properties on an OBJECT
for (let k in myObject) { // look at the keys and values in myObject
  console.log(k, myObject[k]);
}
// It’s a good idea to use for..in loops only on objects, and traditional for loops with numeric index iteration for arrays.
// because for in loops will enumerate all numeric indices of the array as well as enumerable properties

// propertyIsEnumerable(..) tests whether the given property name exists directly on the object and is also enumerable:true.
myObject.propertyIsEnumerable('a'); //?
myObject.propertyIsEnumerable('b'); //?
// Object.keys(..) returns an array of all enumerable properties, whereas Object.getOwnPropertyNames(..) returns an array of all properties, enumerable or not.
Object.keys(myObject); //?
Object.getOwnPropertyNames(myObject); //?
Object.values(myObject); //?

