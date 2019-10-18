// spread operator: turns an array into a list of values or function parameters

// rest operator   ... ===
//                     === ... spread operator

// Say we have two arrays and we need to add the elements of the second array to the end of the first one.
let array1 = [1, 2, 3];
let array2 = [4, 5, 6];

array1.push(...array2); // delete the ... and observe the output
array1 //?

// Finding a maximum value in the array is also easy with the spread operator:
const maxValue = Math.max(...array1);
maxValue //?


// Cloning
// Clone with Object.assign()
let myObject = {name: "Mary" , lastName: "Smith"};
const clone = Object.assign({}, myObject);
console.log(clone);

// Clone with modifying the `lastName` property
const cloneModified = Object.assign({}, myObject, {lastName: "Lee"});
console.log(cloneModified)

// Clone with spread
const myObject2 = { name: 'Mary', lastName: 'Smith'};
const cloneSpread = {...myObject2}
cloneSpread //?

// clone with modifying the lastName
const cloneSpreadModified = {...myObject, lastName: 'Lee'};
cloneSpreadModified //?
// WHY CLONE vs assignment? The clone is immutable; changes to the source does not effect the clone
myObject = {name: "poopoo" , lastName: "Smith"};
cloneSpreadModified //?
myObject //?