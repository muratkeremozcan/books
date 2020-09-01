// falsy values: false, +0, -0, "", null, undefined

// these work as expected
var x = false;
var y = 0;
var z = '';
Boolean(x); //?
Boolean(y); //?
Boolean(z); //?
Boolean(x && y && z); //?

var a = new Boolean(false); //? 
var b = new Number(0); //?
var c = new String(''); //?
// WTF, falsy values wrapped around Boolean return true
// the lesson: don't boolean check falsy values that are wrapped by object wrappers. Object wrappers do not end up being falsy 
Boolean(a); //?
Boolean(b); //?
Boolean(c); //?
Boolean(a && b && c); //?
// without Boolean wrap, the last one gets the final say
b && c && a; //?


// a value is truthy if it's not on the falsy list
// the truthy list is infinitely long. It’s impossible to make such a list.
  // You can only make a finite falsy list and consult it

// string values are all truthy
Boolean( 'false' && '0' && "'"); //?
// these are not on the falsy list
Boolean([] && {} && function(){}); //?