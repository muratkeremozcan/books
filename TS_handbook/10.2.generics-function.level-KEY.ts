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
reversed[0] = 1; // ok 
reversed[0] = <number><any>'1'; // ok with type casting

// arguments of reversed array has to match sample's type, TS will complain
reversed = ['1', '2', '3'];
reversed = [1, 2, 3]; // ok



/// (3) generics for member functions : same thing as (2)

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
