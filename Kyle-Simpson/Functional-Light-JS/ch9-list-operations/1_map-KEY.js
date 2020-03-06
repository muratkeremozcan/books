const addTwo = num => num + 2;
const numbers = [5, 6, 7];

// map applies the callback function to every element in the array, and returns a new array 
numbers.map( function(i) {
  return i * 2;
}); //?


// map implemented from scratch with for loop
function map_imperative(array, mapperFn) {
  let newArray = [];
  for(let i = 0; i < array.length; i++) {
    newArray.push(mapperFn(array[i]));
  }
  return newArray;
}
map_imperative(numbers, addTwo); //?


///////////

// note that in the below map, idx and array.entries are extra to keep consistency with built-in map. 
// You in fact only need v and array  for(let v of array), and then mapperFn(v)
// Note: you can iterate over a array's entries using entries()
[...numbers.entries()];//?

// map implemented from scratch with for of loop
export function map(array, mapperFn) {
  let newArray = [];
  for(let [idx, v] of array.entries()) {
    newArray.push(mapperFn(v, idx, array)); 
  }
  return newArray;
}
map(numbers, addTwo); //?
