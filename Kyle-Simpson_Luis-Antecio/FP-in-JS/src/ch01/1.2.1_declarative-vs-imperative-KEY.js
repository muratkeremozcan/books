// functional programming refers to the declarative evaluation of pure functions 
// to create immutable programs by avoiding externally observable side effects. 



// (1) declarativeness
// loop example with FP
{ // imperative
  let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < array.length; i++) {
    array[i] = Math.pow(2, array[i]);
  }
  // array is mutated!
  array; //?
}

{ // declarative
  let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // map is great when trying to avoid mutating data (side note: filter is great for conditional logic)
  const power2 = arr => arr.map(num => Math.pow(2, num));
  power2(array); //?
}


// (2) pureness

// impure
// because return value is dependant on external variable
var counter = 0;

function increment() {
  return ++counter;
}
increment(); //?

// pure
// when dealing with external variables, to make things pure, pass that variable instead as a function argument
function increment_pure(counter) {
  return ++counter;
} 
increment_pure(0); //?


// (3) immutability 
// in this example, we see the opposite of it and the major concern with mutating arrays

// sort an array descending
// Arr.sort function is stateful and causes the effect of sorting the array in place. 
// In FP, we don't want this, more later
// https://devdocs.io/javascript/global_objects/array/sort

var sortDesc = arr => arr.sort((a,b) => b-a);
var arr = [1, 2, 3, 4]
sortDesc(arr); //?
// not good, arr changed
arr; //?


// (4) avoiding external side effects
// referential transparency: pure functions that always return the same output when provided with the same input

// ex: average of grades
var sum = (total, current) => total + current;
var total = arr => arr.reduce(sum);
var size = arr => arr.length;
var divide = (a, b) => a / b;
var average = arr => divide(total(arr), size(arr));

average([80, 100, 120]); //?

