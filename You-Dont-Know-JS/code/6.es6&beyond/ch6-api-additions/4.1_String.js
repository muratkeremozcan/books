// unicode aware String operations
// fromCodePoint works with hexadecimals
String.fromCodePoint( 0x1d49e ); //?
// codePointAt gives decimal, need to convert it
"ab𝒞d".codePointAt( 2 ).toString( 16 ); //?
"ab𝒞d".codePointAt( 0 ); //?
"ab𝒞d".codePointAt( 1 ); //?
"ab𝒞d".codePointAt( 1 ).toString(2); //?
"ab𝒞d".codePointAt( 1 ).toString(16); //?

// The normalize(..) string prototype method is used to perform Unicode normalizations that 
// either combine characters with adjacent “combining marks” or decompose combined characters
var s1 = "e\u0301"; //?
s1; //?
s1.length; //?

var s2 = s1.normalize(); //?
s2; //?
s2.length; //?
// unicode escape character
s2 === '\xE9'; //?


//////////////////////
// String.raw()
// The String.raw(..) utility is provided as a built-in tag function to use with template string literals
// for obtaining the raw string value without any processing of escape sequences

var str = 'bc';
// "\tabcd\xE9", not "abcdé" , \ and t are separate raw characters, same for unicode escape sequence
String.raw`\ta${str}d\xE9`; //?

/////////////////////
// repeat()
'foo'.repeat(3); //?


////////////////////
// String Inspection: in addition to indexOf() and lastIndexOf(), startsWith(), endsWith(), includes()

var palindrome = 'step on no pets';
palindrome.indexOf('on'); //?
palindrome.lastIndexOf('o'); //?
palindrome.startsWith('step on'); //?
palindrome.endsWith('no pets'); //?
palindrome.endsWith('no', 10); //?
palindrome.includes('on'); //?
palindrome.includes('on', 5); //?
// empty string by default in the beginning and end
palindrome.indexOf('', ); //?
palindrome.lastIndexOf('', ); //?



// One extremely common task JS developers need to perform is searching for a value inside an array of values.

var vals = ['foo', 'bar', 42, 'baz'];

if (vals.indexOf(42) >= 0) {
  console.log('found'); 
}

// The (tilde) ~ operator first “coerces” to a 32-bit number value, and then performs a bitwise negation (flipping each bit’s parity).
// - (x + 1)  , the only value that results in a false/0 here is -1
~42; //?
~-1; //?
// Using ~ with indexOf() “coerces” (actually just transforms) the value to be appropriately boolean-coercible
// IMPORTANT: checking index of a string ~ is the meta, takes 1 line to check for indexOf() returning false
if (~vals.indexOf(42)) {
  console.log('found');
}

// ES6 proposal:
if (vals.includes(42)) {
  console.log('found');
}