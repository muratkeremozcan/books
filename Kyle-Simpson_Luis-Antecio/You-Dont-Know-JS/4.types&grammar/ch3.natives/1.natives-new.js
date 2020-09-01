// commonly used natives: Boolean()  Number()  String()  Array()  Object()  Function()  RegExp()  Date()  Error()  Symbol() — added in ES6!
// these native objects are 'subtypes of the object type

var a = new String('abc');
// typeof a is object, not string, but a is an instance of String
  // new String("abc") creates a string wrapper object around "abc", it does not just create the primitive "abc" value itself.
typeof a; //?
a instanceof String; //?

var b = new Array([1,2,3]);
typeof b; //?
b instanceof Array; //?

// these objects are also tagged with a [[Class]] property
  // think of this more as an internal classification rather than related to classes from traditional class-oriented coding
  // this property can be revealed indirectly with Object.prototype.toString() method called against the value
  // each of the simple primitives are automatically boxed by their respective object wrappers, which is why "String", "Number", and "Boolean" are revealed as the respective internal [[Class]] values.
  
Object.prototype.toString.call(true); //?
Object.prototype.toString.call(42); //?
Object.prototype.toString.call('abc'); //?
Object.prototype.toString.call({}); //?
Object.prototype.toString.call(function() {/** */}); //?
Object.prototype.toString.call(/regex-literal/i); //?
Object.prototype.toString.call([1,2,3]); //?
Object.prototype.toString.call(null); //?
Object.prototype.toString.call(undefined); //?

