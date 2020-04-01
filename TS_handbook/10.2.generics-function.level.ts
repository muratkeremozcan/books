// (2) Generics at function level (arguments and return values)

// reverse array
// the generic ensures that same type of items are received and returned

function reverseArr<T>(items: T[]): T[] {
  let reversed = [];
  for (let i = items.length - 1; i >= 0; i--) {
    reversed.push(items[i]);
  }
  return reversed;
}

let sample = [1, 2, 3]
let reversed = reverseArr(sample);

reversed; //?
reverseArr([1, 2, 3]); //? 

// the reversed array has to match sample's type, TS will complain
reversed[0] = '1'; 

// arguments of reversed array has to match sample's type, TS will complain
reversed = ['1', '2', '3']; //?


/// generics for member funtions 

class Utility {
  reverseArr<T>(items: T[]): T[] {
    let reversed = [];
    for (let i = items.length - 1; i >= 0; i--) {
      reversed.push(items[i]);
    }
    return reversed;
  }
}
const util = new Utility();

let sample2 = [5, 6, 7];

let reversed2 = util.reverseArr(sample);
// same deal
sample2[0] = '1';
sample2 = ['5', '6', '7'];



// (unrelated) type inference example
type Adder = (numbers: { a: number, b: number }) => number;

function iTakeAnAdder(adder: Adder) {
    return adder({ a: 1, b: 2 });
}

iTakeAnAdder(({a, b}) => { // Types of `a` and `b` are inferred
    a = "hello"; // Would Error: cannot assign `string` to a `number`
    return a + b;
})