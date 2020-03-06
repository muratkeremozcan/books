const moreThanFive = num => num > 5;

const numbers = [5, 6, 7];

// filter tests the condition and returns the passing result(s)
numbers.filter(function (i) {
  return (i >= 6);
}); //?  


// filter from scratch with for loop
function filter_imperative(array, predicateFn) {
  let newList = [];
  for (let i = 0; i < array.length; i++) {
    if (predicateFn(array[i])) {
      newList.push(array[i]);
    }
  }
  return newList;
}
filter_imperative(numbers, moreThanFive,); //?


////////

// filter from scratch with for of loop
export function filter(array, predicateFn) {
  let newList = [];
  for (let [idx, v] of array.entries()) {
    if (predicateFn(v, idx, array)) {
      newList.push(v);
    }
  }
  return newList;
}
filter(numbers, moreThanFive); //?



/////
import { not } from '../fp-tool-belt';
const isOdd = num => num % 2 == 1;
const isEven = not(isOdd);

numbers.filter(isOdd); //?
numbers.filter(isEven); //?