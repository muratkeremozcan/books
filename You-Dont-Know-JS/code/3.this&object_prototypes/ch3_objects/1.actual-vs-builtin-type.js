// Built in objects

// simple primitives  : string  number  boolean  object  null   undefined  
// complex primitivs  : String  Number  Boolean  Object  Array  Date  RegExp  Error (all of type object)
// side note, falsies : ''      0       false            null   undefined

// string primitive 
var strPrimitive = 'I am string'; 

typeof strPrimitive; //?

// the simple primitive is of type string, but it is not the built-in object/function String
strPrimitive instanceof String; //?  

// when/if we call a property or method on a string primitive, 
  // the engine automatically coerces it to a String object, so that the property/method access works.
strPrimitive.length; //?
strPrimitive.charAt(3); //?


// built-in objects/function (complex primitives) can be used as a constructor 
var strObject = new String('I am string');

typeof strObject; //?

strObject instanceof String; //?

// we can inspect the internal subtype by borrowing the base default toString() method,
Object.prototype.toString.call(strObject);    //?
Object.prototype.toString.call(strPrimitive); //?

////////
// contents of an object
var myObject = { 
  'super-fun': 2,
  a: 5
};

// the main difference between the . operator (property access) and the [] operator (key access) is
  // that the . operator has to have a identifier-compatible property name,
  // whereas the [] operator can take any UTF-8/Unicode-compatible string as the name for the property
myObject['super-fun']; //?
myObject.a; //?

/////////
// In objects, property names are always strings. 
  // If you use any other value besides a string (primitive) as the property, it will first be converted to a string.

var myObject = { };

myObject[3] = 'bar';
myObject[true] = 'foo';
myObject[myObject] = 'baz';

myObject['3'] //?
myObject['true'] //?
myObject['myObject'] //?
myObject; //?
