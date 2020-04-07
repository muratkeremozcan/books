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

  const power2 = arr => arr.map(num => Math.pow(2, num));
  power2(array); //?
}