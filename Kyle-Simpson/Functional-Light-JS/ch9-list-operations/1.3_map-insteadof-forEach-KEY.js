var myArray = [5, 6, 7];

// forEach iterates over the values and ignores any callback return values. 
// not useful with Objects, used with arrays. ._. forEach can be used with objects
myArray.forEach( function mapperFn(v) {
  console.log(v);
  return `hello ${v}`; // ignored
}); //?

// map(..) returns the array so you can keep chaining more operations after it;
// in contrast, the return value of forEach(..) is undefined
myArray.map(function mapperFn(v) {
  console.log(v);
  return `hello ${v}`;
}); //? 



// note on functor
// a functor is a value that takes an associated value (ex: an array in map) and an operating function
// and executes the operating function for each associated value. 
// Finally, returns a new array with all the newly mapped values in it.
// map is a functor, foEach is not.