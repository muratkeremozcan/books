//// Why boxing?
// JS will automatically box (aka wrap) the primitive value to fulfill needs to access .length ,to.string() etc.

var a = 'abcd';
var b = 423;

a.length; //?
a.toUpperCase(); //?

// In general, there’s no reason to use the object form directly. It’s better to just let the boxing happen implicitly where necessary. 
  // In other words, never do things like new String("abc"), new Number(42), etc. — always prefer using the literal primitive values "abc" and 42.


// Gotchas if you use the object form

// objects are truthy, it does not matter if you create an object wrapper around a falsy value
  // false, 0, '', null, undefined
var a = new Boolean(false) //?
if(!a) {
  console.log('oops'); //?
}

// Unboxing : use valueOf() if you have an object wrapper and you want the get the underlying primitive value
var a = new String('abc');
var b = new Number(42);
var c = new Boolean(true);
a.valueOf(); //?
b.valueOf(); //?
c.valueOf(); //?

// can also happen by coercion
a = new String('abc');
b = a + ''; //?
typeof a; //?
typeof b; //?

