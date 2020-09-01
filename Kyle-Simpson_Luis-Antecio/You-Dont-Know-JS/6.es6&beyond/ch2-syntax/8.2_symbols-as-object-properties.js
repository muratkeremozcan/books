// If a symbol is used as a property/ key of an object, it’s stored in a special way 
// so that the property will not show up in a normal enumeration of the object's properties

var o = {
  foo: 42,
  [ Symbol('bar') ]: 'hello world',
  baz: true
}

Object.getOwnPropertyNames(o); //?
Object.getOwnPropertySymbols(o); //?


// Built-in Symbols in ES6

var a = [1,2,3,4];

a[Symbol.iterator]; //?
