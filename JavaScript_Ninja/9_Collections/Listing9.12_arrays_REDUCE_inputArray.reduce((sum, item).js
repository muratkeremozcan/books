const numbers = [1, 2, 3, 4];

// REDUCE method:  inputArray.reduce((sum, item) => { ....},0)
const sum = numbers.reduce((sum, number) => { // REDUCE : a callback to each input array item, iterates, starts with initial value...
  return sum + number; // ... and applies the result of the previous callback on the next one
}, 0); // initial value

// crude way:
// const sum = 0;
// numbers.forEach( number => {
//   sum += number;
// });

console.log(sum);