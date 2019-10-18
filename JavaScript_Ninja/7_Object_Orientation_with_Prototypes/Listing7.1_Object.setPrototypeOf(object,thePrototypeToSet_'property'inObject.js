var assert = require('assert');

const yoshi = { skulk: true };
const hattori = {sneak: true};
const kuma = { creep: true };

// to test whether an object has access to a property, we can use the IN operator
// '<property>' in <object>
console.log('skulk' in yoshi);
console.log('sneak' in yoshi);
console.log('creep' in yoshi);

// Object.setPrototypeOf(<object>, <the prototype you want to set>)
Object.setPrototypeOf(yoshi, hattori); // set the prototype of yoshi as hattori
console.log('skulk' in yoshi);
console.log('sneak' in yoshi);
console.log('creep' in yoshi);

// setting a prototype chain
Object.setPrototypeOf(hattori, kuma);
console.log('skulk' in yoshi);
console.log('sneak' in yoshi);
console.log('creep' in yoshi);