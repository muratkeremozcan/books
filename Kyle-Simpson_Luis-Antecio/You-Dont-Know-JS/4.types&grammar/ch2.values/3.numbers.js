// most numbers will be outputted as base-10 decimals, with trailing fractional 0s removed.

var a = 42.0; //?
var b = 42.300; //?

// numbers can be specified in exponent form
// exponent form is also used if the number is very small, like the output of toExponential() method
a = 5E10; //?
a.toExponential(); //?

b = a * 3; //?
var c = 1 / a; //?

// number values can access methods that are built into the Number.prototype

c.toFixed(); //?

a = 42.59;
a.toFixed(1); //?
a.toFixed(2); //?
a.toFixed(4); //?
// the output result of toFixed() is a string
typeof a.toFixed(4); //?
// to shave off padding 0s, toPrecision() should be used
a.toPrecision(4); //?
typeof a.toPrecision(4); //?
a.toExponential(4); //?
typeof a.toExponential(4); //?

// be careful with the . operator. Since . is a valid numeric character, it will first be interpreted as part of the number literal, 
  // instead of being interpreted as a property accessor. Wrap it in ( ) for property access
  // note: it is uncommon to see access methods on values, but not wrong
(4).toFixed(3); //?


//// bases / modular

// 0x for hexadecimal 
0xf3; //?
// 0o for octal
0o363; //?
// 0b for binary
0b11110011; //?
// convert decimal to binary, octal, hex
(243).toString(2); //?
(243).toString(8); //?
(243).toString(16); //?
// the type is string
typeof(243).toString(16); //?
// but you can convert it back to a Number (not great, because hex)
Number((243).toString(8)); //?
// problem is with hex, returns NaN
var hex243 = Number((243).toString(16)); //?

// parseInt can be the solution. It is also the reverse of toString()

typeof parseInt(243); //?
// can covert a string to a number with any radix
parseInt(243, 10 )  //?
parseInt(0xf3, 10) //?
parseInt('f3', 16); //?
parseInt( (243).toString(16) , 16); //?


//// small numbers

// (in)famous side effect of using binary floating-point numbers
0.1 + 0.2 === 0.3; //?
(0.1 + 0.2) //?
// how do you work around it? Number Epsilon
// Number.EPSILON is the smallest representable value in JS
Number.EPSILON //?

function numbersCloseEnoughToEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
numbersCloseEnoughToEqual(0.1 + 0.2, 0.3); //?

// on the contrary the largest representable value in JS is Number.MAX_VALUE
Number.MAX_VALUE //?

// safe integer ranges : usually for 64-bit IDs from databases
Number.MAX_SAFE_INTEGER //?
Number.MIN_SAFE_INTEGER //?

// testing if integer
Number.isInteger(42); //?
Number.isInteger(42.000); //?
Number.isInteger(42.0123); //?
Number.isSafeInteger(Math.pow(2, 42)); //?
Number.isSafeInteger(Math.pow(2, 53)); //?
Number.isSafeInteger(Math.pow(2, 53) -1 ); //?


////////

// Void operator: the result of  ' void <anything> ' is undefined
  // Void can be useful if the expression has to return something, even a no-result value 
  // {
  //   return void setTimeout( doSomething,100 );
  // }
  //  the 2 can be separated
  // {
  //   setTimeout( doSomething,100 );
  //   return;
  // }


// NaN : think of it as “invalid number,” “failed number,” or even “bad number,” 
  // essence, “I tried to perform a mathematic operation but failed, so here’s the failed number result instead.”

a = 2/ 'foo'; //?
b = 2/ 'foo'; //?
// NaN is not even equal to itself
a === b; //?
// to test for NaN
Number.isNaN(a); //?

// infinity
a = 1 / 0; //?
b = -1 / 0; //?
// in JavaScript, Infinity / Infinity is not a defined operation. In JS, this results in NaN.
a / a; //?
a / b; //?

// Object.is a new utility in ES6 to test 2 values for absolute equality, useful for off cases like NaN and -0
Object.is(a, Infinity); //?
Object.is(a / a, NaN); //?
// negative 0 in JS!
c = -1 * 0; //?
Object.is(c, 0); //?
Object.is(c, -0); //?
// Object.is works better than === for NaN and -0 . Object.is does not need to be used where === is known to be safe
c === -0; //?
a / a === NaN; //?