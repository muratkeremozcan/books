var a = [ 'a', 'b', 'c', 'd', 'e' ];

// for-in puts out the INDEX/KEY; more useful with objects
for (var idx in a ) {
  console.log(idx);
}


// ES6: for-of puts out VALUES; not for objects but iterables: arrays, strings, generators, collections/typedArrays
for (var idx of a ) {
  console.log(idx);
} 
// pre ES6 was a pain 
var k = Object.keys(a); //? 
for (var val, i = 0; i < k.length; i++) {
  val = a[ k [i] ];
  console.log(val);
}


// here is a string example of for of, since strings are iterable
for (var c of 'Hello') {
  console.log(c);
}


// for.. of loops can be prematurely stopped, just like other loops, with break, continue, return (if in a function), and thrown exceptions. 
// In any of these cases, the iterator’s return(..) function is automatically called (if one exists) to let the iterator perform cleanup tasks, if necessary.
