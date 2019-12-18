// for of loop can consume iterators (arrays, strings, generators, collections/typedArrays), 
// there are also other structures that can

var a = [1, 2, 3, 4, 5];
function foo(x, y, z, w, p) {
  return (x + y + z + w +p); //?
}

// the ...spread operator fully exhausts an iterator
foo(...a);

// can also ...spread an iterator inside an array
var b = [0, ...a, 6];
b;

// array destructuring can consume an iterator
var it = a[Symbol.iterator]();  // [Symbol.iterator]() specifies the default iterator for an object.
// take just the first 2 elements from 'it'
var [x, y] = it;
x; //?
y; //?
// take the third and then the rest 
var [z, ...w] = it; 

z; //?
w; //?
console.log(...w);

// now 'it' is fully exhausted
it.next(); //?