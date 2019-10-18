var myArray = ['foo', 42, 'bar'];

// you can add properties to an array, because arrays are objects
// Notice that adding named properties (regardless of . or [ ] operator syntax) does not change the reported length of the array.

myArray.baz = 'baz';
myArray['foob'] = 'foob'; 
myArray.length; //?
myArray.baz; //?
myArray[2];//?
myArray;

// using key operator [ ], if you try to add a property to an array and the property name looks like a number, it will end up instead as a numeric index
myArray['3'] = 'mur';
myArray
myArray.length; //?
// ok if the named property does not look like a number
myArray['abc'] = 'abc';
myArray;
myArray.length; //?

// Use objects to store key/value pairs, and arrays to store values at numeric indices.
