var numbers = [5, 10, 15];

// reduce applies the callback function to every element in the array
// has an accumulator which keeps the returned value after every iteration 
// (accumulator takes the value of optional initial value in the first iteration)
// If the optional initial value is not supplied, the first element is used as the initial value
numbers.reduce((accumulator, current) => accumulator + current, 2); //?
numbers.reduce((current) => current); //?
numbers.reduce((current) => current, 2); //?


const summingReducer = (accumulator, current) => accumulator + current;
numbers.reduce(summingReducer, 2); //?

const multiplyingReducer = (accumulator, current) => accumulator * current;
numbers.reduce(multiplyingReducer, 3); //?


// reduce with for loop
function reduce_imperative(reducerFn, array, initialAccumulatorValue = 0) {
  let accumulatorValue = initialAccumulatorValue;
  for (let i = 0; i < array.length; i++) {
    accumulatorValue = reducerFn(accumulatorValue, array[i]);
  }
  return accumulatorValue;
}
reduce_imperative(summingReducer, numbers, 2); //?


// map as reduce - not KEY
const double = v => v * 2;
numbers.map(double); //?

numbers.reduce(
  (list, v) => (
    list.push(double(v)),
    list
  ), []
);

// filter as reduce - not KEY
const isOdd = v => v % 2 == 1;

numbers.reduce(
  (list, v) => ( 
    isOdd(v) ? list.push(v) : undefined,
    list
    ), [] 
);


/////
// reducer with pipe - not KEY

import { pipe, binary } from '../fp-tool-belt';

const pipeReducer = binary(pipe);

var fn = [3, 2]
  .map(v => n => v * n)
  .reduce(pipeReducer)

fn(1); //?

[3]
  .map(v => n => v * n)
  .reduce(pipeReducer)(5); //?