// String <-> Number

// To coerce between strings and numbers, we use the built-in String(..) and Number(..) functions
  // but very importantly, we do not use the new keyword in front of them. As such, we’re not creating object wrappers. 
  // Instead, we’re actually explicitly coercing between the two types:

var a = 42;
var b = String(a); //?
var k = a.toString(); //?
// toString cannot be called on a primitive value, so JS boxes 42 in an object wrapper so that toString() can be called
(42).toString(); //?
typeof (42).toString(); //?

var c = '3.14';
var d = Number(c); //?
typeof d; //?

// the + operator, instead of performing mathematic addition (or string concatenation), it explicitly coerces its operand (c) to a number value.
var z = +c //?
typeof z; //?
// be vary of the unary operator confusion
var x = z + +c //?
// You should strongly consider avoiding unary + (or -) coercion when it’s immediately adjacent to other operators, also increment or decrement operators
1 + - + + + - + 1; //?


///// Date to number

// the result is the Unix timestamp (milliseconds elapsed since 1 January 1970 00:00:00 UTC) representation of the date/time value:
// check out https://www.epochconverter.com/
var d = new Date('Mon, 18 Aug 2017 08:53:06 CDT');
+d; //?

// most common
var timestamp = new Date(); //?
var num_timestamp = +new Date(); //?
var num_timestamp_same = Number(new Date()); //?

// more explicit coercion
var timestamp2 = new Date().getTime(); //?

// even more explicit with ES6
var timestamp3 = Date.now(); //?


/// The (tilde) ~ operator first “coerces” to a 32-bit number value, and then performs a bitwise negation (flipping each bit’s parity).
// - (x + 1) // the only value that results in a 0 here is -1 
~42; //?

// indexOf() operator returns a -1 if it does not find what it is looking for
// devs have a yucky way of checking this, instead you can use the ~ operator
var a = 'Hello World';

if (a.indexOf('lo') >= 0 ) console.log('found');
if (a.indexOf('lo') != -1 ) console.log('found');
if (a.indexOf('lo') < 0 ) console.log('found'); // not found
if (a.indexOf('lo') == -1 ) console.log('found'); // not found

// Using ~ with indexOf() “coerces” (actually just transforms) the value to be appropriately boolean-coercible:
~a.indexOf('lo'); //?

// IMPORTANT: checking index of a string ~ is the meta
// takes 1 line to check for indexOf() returning false  
if (~a.indexOf('lo') ) console.log('found');

if (~a.indexOf('ol') ) console.log('found'); // not found
// can flip it
!~a.indexOf('ol'); //?

// double tilde can be used  ~~ to truncate the decimal part of a number (i.e., “coerce” it to a whole number integer)
// very similar to parity double-negate !! , but ~~ only works on 32 bit values.
// it works differently on negative numbers than Math.floor()

// IMPORTANT: checking absolute values of negative numbers, ~~ is the meta
// ok for positive numbers
~~49.6; //?
Math.floor(49.4); //?
~~-49.6; //?
// AHA! So, use ~~ for absolute values of negative numbers instead of Math.floor()
Math.floor(-49.4); //?

// ~~ can also truncate to a 32 bit integer, like x | 0 . The only difference is operator precedence
~~1E20; //?
1E20 | 0; //?

~~1E20 / 10; //?
1E20 | 0 / 10; //?
(1E20 | 0) / 10; //?