/*
Set is an UNORDERED collection of UNIQUE objects, doesn't allow DUPLICATES, while Map provides a data structure based on KEY_VALUE pairs
*/
const ninjas = new Set(["Kuma", "Hattori", "Yagyu", "Hattori"]); // Set constructor can take an array of items with which the set is initialized

console.log(ninjas.has("Hattori")); // SET.HAS
console.log(ninjas.size); // 3 , discards any duplicate items
console.log(ninjas);

console.log(ninjas.has("Yoshi"));
ninjas.add("Yoshi"); // SET.ADD()
console.log(ninjas.size); // you can add new items that aren't already contained in the set
console.log(ninjas);

ninjas.add("Kuma");
console.log(ninjas.size); // adding duplicate items has no effect
console.log(ninjas);
// ninjas.indexOf("Kuma");

for (let ninja of ninjas) { // like maps and arrays, sets are collections so we can iterate over them
  console.log(ninja); // items are iterated in the order in which they were inserted to the Set
}

// And of course, we can also convert a set back to array using Array.from() method.
const arrayFromNinjasSet = Array.from(ninjas);
console.log(arrayFromNinjasSet);


// IMPORTANT Set does not support random access to an element by index
// accessing an elements in Array (one after the other such as in a for loop) is quicker and more efficient if you compared to Sets
// Checking if an element is in Set has simpler syntax than Array by using Set.prototype.has(value) VS Array.prototype.indexOf(value)
// ES6 does provide Array.prototype.includes()
// In Set, there is only one way to add new element — Set.prototype.add() . O(1) runtime vs O(n) in array unshift
// 3 ways to delete in array, 1 way to delete in set


// Array is meant for scenarios when we want to keep elements ordered for quick access, or do heavy modification (removing and adding elements) or any action required direct index access to elements
// We want to use set when we want to avoid saving duplicate data to our structure and/or do operations like union(), intersect(), difference()
// https://medium.com/front-end-hacking/es6-set-vs-array-what-and-when-efc055655e1a