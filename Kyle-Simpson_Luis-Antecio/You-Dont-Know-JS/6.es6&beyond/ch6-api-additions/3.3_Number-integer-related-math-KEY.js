// JavaScript number values are always floating point (IEE-754). 
// So the notion of determining if a number is an “integer” is not about checking its type, because JS makes no such distinction.
// Instead, you need to check if there’s any nonzero decimal portion of the value. The easiest way to do that has commonly been x === Math.floor(x)
// ES6 adds a Number.isInteger(..) helper utility that potentially can determine this quality slightly more efficiently:

var x = 10.9;
var y = 10;

x === Math.floor(x); //?
Math.floor(x); //?
y === Math.floor(y); //?


// ES6
Number.isInteger(x); //?
Number.isInteger(y); //?


// Note: in JavaScript, there’s no difference between 4, 4., 4.0, or 4.0000. All these would yield true
Number.isInteger(4.0); //?


// Number.isInteger() filters out some clearly not-integer values that x === Math.floor( x) could potentially mix up
// don't want this
Infinity === Math.floor(Infinity); //?
// good
Number.isInteger(NaN); //?
Number.isInteger(Infinity); //?


// isFloat() utility for JS
// Because of Number.isInteger(..)’ s handling of NaN and Infinity values, defining a isFloat(..) utility would not be just as simple as !Number.isInteger(..)
function isFloat(x) {
  return (
    Number.isFinite(x) && 
    !Number.isInteger(x)
  );
}

isFloat(4.2); //?
isFloat(4); //?
isFloat(NaN); //?
isFloat(Infinity); //?



// ES6 also defines a Number.isSafeInteger(..) utility, which checks to make sure the value is both an integer and within the range of 
// Number.MIN_SAFE_INTEGER-Number.MAX_SAFE_INTEGER (inclusive).
var x = Math.pow(2, 53);
    y = Math.pow(-2, 53);
x;
Number.MAX_SAFE_INTEGER; //?
y;
Number.MIN_SAFE_INTEGER; //?

Number.isSafeInteger(x - 1); //?
Number.isSafeInteger(x + 1); //?
Number.isSafeInteger(x); //?
Number.isSafeInteger(Number.MAX_SAFE_INTEGER); //?