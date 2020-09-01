// The for..in loop iterates over the list of enumerable properties on an object

var myArray = [5, 6, 7];

// with numerically indexed arrays, iterating over the values is typically done with a standard for loop
  // this iterates over the indices, not values. You can access the values with [i]
for(var i = 0; i < myArray.length; i++) {
  console.log(i);
  console.log(myArray[i]);
}
for (var i = myArray.length -1 ; i >= 0; i--) {
// for (var i = myArray.length; i--;) { // alternative
  console.log(i);
  console.log(myArray[i]);
}

// forEach iterates over the values and ignores any callback return values. not useful with Objects, used with arrays
// ._. forEach can be used with objects
myArray.forEach( function(i) {
  console.log(i);
  return 'hello' + i; // ignored
}); //?

// every tests if all the elements in the array pass the test implemented by the callback function. If it hits false, it breaks . returns boolean
myArray.every( function(i) {
  return (i >= 6);
}); //?

// tests if ANY of the elements in the array pass the test implemented by the callback function . returns boolean
myArray.some( function(i) {
  return (i === 5);
});// ?

// filter tests the condition and returns the passing result(s)
myArray.filter( function(i) {
  return (i >= 6);
}); //?  

// tests the condition, returns the first passing result
myArray.find( function (i) {
  return i === 6;
  // return i === 10; // undefined
}); //?  

// map applies the callback function to every element in the array, and returns a new array 
myArray.map( function(i) {
  return i * 2;
}); //?

// return a random array element
// https://timonweb.com/tutorials/how-to-get-a-random-value-from-a-javascript-array/
myArray[ Math.floor( Math.random() * myArray.length) ]; //?

// reduce applies the callback function to every element in the array. 
// Has an accumulator which keeps the returned value after every iteration
// Has an optional initial value, the value of the accumulator in the first iteration. If not supplied, the first element is used as the initial value
myArray.reduce( function(accumulator, i) {
  console.log(i);
  console.log(accumulator);
  return accumulator + i * 2; //? 
}, 1  /* the optional initial value */); //?

// for of returns the values, not the indices like for in. PREFERRED with ARRAYs. Does not work with Objects because objects are not iterable with [Symbol.iterator]
  // for of is like a forEach that returns values. It is usable with arrays as well as anything iterable, like NodeLists https://bitsofco.de/for-in-vs-for-of/
for (var k of myArray) {
  console.log(k);
}

// for in returns the indices/keys, the values are accessed with [i]. PREFERRED with OBJECTS
// It’s a good idea to use for in loops only on objects, and traditional for loops with numeric index iteration for arrays.
// because for in loops will enumerate all numeric indices of the array as well as enumerable properties
for (var k in myArray) {
  console.log(k);
  console.log(myArray[k]);
}

