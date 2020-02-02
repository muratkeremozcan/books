var numbers = [5, 6, 7];

// reduce applies the cb function to every element in the array
// has an accumulator which keeps the returned value after every iteration (accumulator takes the value of optional initial value in the first iteration)
// If the optional initial value is not supplied, the first element is used as the initial value
numbers.reduce( (accumulator, current) => accumulator + current, 2); //? 

numbers.reduce( function(accumulator, current) {
  current;
  accumulator;
  return accumulator + current; //? 
}, 2 ); //?

// FP single point style
const summingReducer = (accumulator, current) => accumulator + current;
numbers.reduce(summingReducer, 2); //?


// reduce from scratch
function reduceArray(reducer, array, initialAccumulatorValue = 0) {
  let accumulatorValue = initialAccumulatorValue; 
  for(let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    accumulatorValue = reducer(accumulatorValue, currentItem); 
  }
  return accumulatorValue;
}
reduceArray(summingReducer, numbers); //?
reduceArray(summingReducer, numbers, 2); //?
