var my_array = ['zero', 'one', 'two', 'three', 'four'];
// usual slice. my_array is set as 'this' context
my_array.slice(3); //?
// 2nd argument to specify the end
my_array.slice(2, 5); //?



// what if you could substitute something else for 'this'? All you need is a 'length' property (array-like object)
var my_object = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  length: 5
};

// call, apply and bind can be used to set the value of 'this'. The second argument is what we are passing into slice
Array.prototype.slice.call ( my_object, 3   ); //?
Array.prototype.slice.apply( my_object, [3] ); //?
Array.prototype.slice.bind ( my_object, 3   )(); //?
// sub array
Array.prototype.slice.call ( my_object, 2, 5); //?
// instead of Array.prototype you can use []
[].slice.call( my_object, 2, 5 ); //?


// in ES6, Array.from(..) can be used 
Array.from(my_object); //?
// I do not know if it can be used for sub-arrays, but...
// Array.from can take a 2nd argument which is a map function
Array.from(my_object, (key, index) => key); //?
Array.from(my_object, (key, index) => index); //?

