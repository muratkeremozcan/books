// these constructor forms should generally be avoided, unless you really know you need them,
  // mostly because they introduce exceptions and gotchas that you probably don’t really want to deal with. Array(..)

// ARRAY

// array constructor does not require the new keyword
var a = Array(1, 2, 3); //?
var b = [1, 2, 3]; //?
// The Array constructor has a special form where if only one number argument is passed, it’s taken as a length to “pre-size" the array
  // this is a bad idea
  // An array with at least one “empty slot” in it is often called a “sparse array.” Also not a good idea
var c = Array(3); //?
c.length; //?
// this has many side effects do not do it

// IMPORTANT: but, if you wanted to actually create an array of actual undefined values (not just “empty slots”), how could you do it
var a = Array.apply(null, {length: 3});
a //?

// OBJECT
// no reason to use new Object() constructor form  :   var a = new Function('a', 'return a * 2');

// REGEX
// preferred for ease of syntax and performance. Also dynamically defines the pattern for regex
var name = "Kyle";
var namePattern = new RegExp( "\\b(?:" + name + ")+\\b", "ig" );
var someText = "Kyle";
var matches = someText.match( namePattern ); //?

// DATE 
// native constructors for these are useful because these have no literal forms

// to get the current Unix timestamp value (an integer number of seconds since Jan 1, 1970).
new Date(); //?
(new Date()).getTime(); //?
// ES6
Date.now(); //?

// ERROR
// also useful
// The main reason you’d want to create an error object is that it captures the current execution stack context into the object 
  // This stack context includes the function call stack and the line number where the error object was created, which makes debugging that error much easier.
// function foo(x) { 
//   if(!x) {
//     throw new Error('x was not provided'); // line number where the Error object was created
//   }
// }
// foo(); // function call stack

// SYMBOL
// Symbols are special “unique”  values that can be used as properties on objects with little fear of any collision.
// Symbols can be used as property names, but you cannot see or access the actual value of a symbol from your program, nor from the developer console.
// If you evaluate a symbol in the developer console, what’s shown looks like Symbol(Symbol.create),
// For most developers, they may take the place of property names with underscore (_) prefixes, which are almost always by convention signals to say  this is a private/special/internal property

// to define your own symbol

var mySymbol = Symbol('my own symbol');
mySymbol //?
mySymbol.toString(); //?
typeof mySymbol; //?

var a = {};
a[mySymbol] = 'foobar';
Object.getOwnPropertySymbols(a); //?