// you cannot directly control value-copy versus reference-copy 
  // it is controlled entirely by the type of the underlying value
  // boolean, number, string, Symbol, null, undefined (simple values)  are VALUE-COPY
  // object, array, function (compound values) are REFERENCE-COPY

// How can you make a proper VALUE-COPY even when working with compound values (object, array, function)
// You need to manually make a copy of of the compound value

function foo(x) {
  x.push(4);
  x; //?
}

var a = [1,2,3];

// copying an array with value-copy
// you can make a copy of the compound value for arrays with slice()
// slice(..) with no parameters by default makes an entirely new (shallow) copy of the array.
var b = a.slice();
// or you can use Array.from()
// var b = Array.from(a);
foo( b )

a
b

//////////////////

// How can you make REFERENCE-COPY when working with simple values (boolean, number, string, Symbol, undefined, null) - not sure why you'd want this
// you have to wrap the simple value in a compound value (object, array etc.)

function foob(wrapper) {
  wrapper.a = 42;
}

var obj = {
  a: 2 // here is my simple value wrapped in a compound value
}

// when obj is passed to foob, a reference copy is made with wrapper = obj, because obj is a compound value
foob(obj); 

// when wrapper sets .a as 42, the shared reference gets modified
obj.a; //?

//////////
// what if you want to pass in a reference to a primitive value like 2 - you can't

function bar(x) {
  x = x + 1;
  x;
}

var a = 2;
// box the value its Number object wrapper
var b = new Number(a); // or new Object(a)

bar(b);
// unfortunately, having a reference to the shared object is not going to give you the ability to modify the shared primitive value
console.log(b)
// The problem is that the underlying scalar primitive value is immutable (same goes for String and Boolean).

// When x is used in the expression x + 1, the underlying scalar primitive value 2 is unboxed (extracted) from the Number object automatically,
  // so the line x = x + 1 very subtly changes x from being a shared reference to the Number object,
  // to just holding the scalar primitive value 3 as a result of the addition operation 2 + 1. 
  // Therefore, b on the outside still references the original unmodified/immutable Number object holding the value 2.
