import { flatten } from '../fp-tool-belt';

// One of the most common usages of flatten(..) behavior is when you’ve mapped a list of elements 
// where each transformed value from the original list is now itself a list of values.

let firstNames = [
  {
    name: "Jonathan",
    variations: ["John", "Jon", "Jonny"]
  },
  {
    name: "Stephanie",
    variations: ["Steph", "Stephy"]
  },
  {
    name: "Frederick",
    variations: ["Fred", "Freddy"]
  }
];

firstNames.map(entry => [entry.name, ...entry.variations]); //?
// the return value is an array of arrays. If we want a single dimension list, we can flatten that result
// however, there is a performance concern since the list is processed twice
flatten(
  firstNames.map(entry => [entry.name, ...entry.variations])
); //?

// The flatMap() method first maps each element using a mapping function, then flattens the result into a new array. 
// It is identical to a map followed by a flat of depth 1, but flatMap is often quite useful, as merging both into one method is slightly more efficient.
firstNames.flatMap(entry => [entry.name, ...entry.variations]); //?
