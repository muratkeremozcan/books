// if either operand to + is a string, the operation will be string concatenation. 
  // Otherwise, it’s always numeric addition.

var a = '42';
var b = '0';
var c = 42;
var d = 0;
var e = [1, 2];
var f = [3, 4];

// concat
a + b; //?
// add
c + d; //?
// converted to string and then concatenated
e + f; //?

// you can coerce a number to a string by adding the number and the "" string
var a = 42;
var b = a + ""; //?
typeof b; //?
// the explicit way
var c = String(a); //?
typeof c; //?