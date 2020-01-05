// for copying || mixing one object's properties to another
// The first argument is the target, and any other arguments passed are the sources. Target object is returned
// non-enumerable or prototype-linked properties do not get copied

var target = {}, 
    o1 = { a: 1 }, 
    o2 = { b: 2 }, 
    o3 = { c: 3 }, 
    o4 = { d: 4 };

// set up read-only property
Object.defineProperty(o3, 'e', {
  value: 5,
  enumerable: true,
  writable: false,
  configurable: false
});

// set up non-enumerable property
Object.defineProperty(o3, 'f', {
  value: 6,
  enumerable: false,
});

// set up enumerable Symbol
o3[Symbol('g')] = 7;

// set up non-enumerable symbol
Object.defineProperty(o3, Symbol('h'), {
  value: 8,
  enumerable: false
});

o3;
o3.f; //?

Object.setPrototypeOf(o3, o4);

// Only the properties a, b, c, e, and Symbol(" g") will be copied to target
// non-enumerable properties and non-owned properties are all excluded from the assignment
Object.assign(target, o1, o2, o3);
target;

Object.getOwnPropertyDescriptor(target, 'e'); //?
Object.getOwnPropertySymbols(target, 'e'); //?