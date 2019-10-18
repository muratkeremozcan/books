var a = '42';
var b = Number(a); // convert to number

a//?
b//?
typeof a; //?
typeof b; //?

var c = /* convert to string */ String(b); //?
c//?
typeof c; //?

// JS coercion
'99.99' == 99.99 //?

const TAX_RATE = 0.08;
var amount = 99.99;

amount *= 2; //?
amount = amount + (amount * TAX_RATE); //?
amount.toFixed(2); //?

a = null;
typeof a //?

var z;
typeof z //?

var y = undefined;
typeof y //?