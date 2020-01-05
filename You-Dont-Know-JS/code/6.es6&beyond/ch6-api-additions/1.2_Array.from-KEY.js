// problem (1): pre ES6, array-like objects (with a length property) were hard to work with because they lack Array.prototype methods

var arrLike = {
  length: 3,
  0: 'foo',
  1: 'bar'
};

arrLike[0]; //?
arrLike[1]; //?
// can't use Array.prototype methods
// arrLike.indexOf('bar'); //?
// arrLike.map(function(x) {
//   return x*2;
// }); //?
  

// problem (2): pre ES6, duplication was less graceful

// If slice() is called without any other parameters, the default values for its parameters have the effect of duplicating the array
var arr = Array.prototype.slice.call(arrLike);
arr; //?
// another example of duplicating the array
var arr2 = arr.slice();
arr2; //?

// ES6 Array.from() solves these problems
arr = Array.from(arrLike);
arr2 = Array.from(arr);
// note that Array.from never produces empty slots (pre ES6 you would have to  Array.apply(null, { length: 3 })
arr;
arr2

arr.indexOf('bar'); //?
arr2.map(x => x+'b'); //?

