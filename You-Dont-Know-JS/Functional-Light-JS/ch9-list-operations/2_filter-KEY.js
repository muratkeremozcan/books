const moreThanFive = num => num > 5;

const numbers = [5, 6, 7];

// filter tests the condition and returns the passing result(s)
numbers.filter(function (i) {
  return (i >= 6);
}); //?  


// filter with for loop
function filter_imperative(predicateFn, array) {
  let newList = [];
  for (let i = 0; i < array.length; i++) {
    if (predicateFn(array[i])) {
      newList.push(array[i]);
    }
  }
  return newList;
}
filter_imperative(moreThanFive, numbers); //?


////////

// filter with for of loop
function filter_declarative(predicateFn, array) {
  let newList = [];
  for (let [idx, v] of array.entries()) {
    if (predicateFn(v, idx, array)) {
      newList.push(v);
    }
  }
  return newList;
}
filter_declarative(moreThanFive, numbers); //?



/////
import { not } from '../fp-tool-belt';
const isOdd = num => num % 2 == 1;
const isEven = not(isOdd);

numbers.filter(isOdd); //?
numbers.filter(isEven); //?