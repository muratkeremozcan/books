var myObject = {
  a: 2
};

// as of ES5, all properties are described in terms of a property descriptor.
Object.getOwnPropertyDescriptor(myObject, 'a'); //?

// we can use Object.defineProperty(..) to add a new property, or modify an existing one (if it’s configurable!), with the desired characteristics.
// WRITABLE (can change the value)
Object.defineProperty(myObject, 'a', {
  value: 2,
  writable: false, // changed writable to false
  configurable: true,
  enumerable: true
});
// writing to a fails if writable = false
myObject.a = 3;
myObject; //?
// can configure the a property of myObject; we can even delete it 
delete myObject.a; //?
myObject.a; //?

// CONFIGURABLE (can use defineProperty)
Object.defineProperty(myObject, 'a', {
  value: 4, // changed the configuration, but had no effect
  writable: true, 
  configurable: false, // because set configurable to false
  enumerable: true
});
// can write, but cannot change the configuration  (cannot edit writable, configurable, enumerable with defineProperty
myObject.a = 3; //?
myObject.a = 5; //?
// since myObject is not configurable anymore, we cannot delete its a property
delete myObject.a; //?
myObject.a; //?

// be careful: once configurable is set to false, you cannot change it back back to true. But true to false can work
Object.defineProperty(myObject, 'a', {
  value: 4,
  writable: true, 
  configurable: true, // trying to change back configurable 
  enumerable: true
});

// immutability : by combining writable: false, configurable: false  you can create a constant

// prevent extensions: prevents adding new property to the object like myObject.b = 10 
// Object.preventExtensions (myObject);

// Object.seal (myObject):   preventExtensions + configurable: false
// Object.freeze (myObject):  preventExtensions + configurable: false + writable: false 
