function Person() {}
Person.prototype.dance = function(){}; // adding a method to the Person's prototype
function Ninja() {}

Ninja.prototype = new Person(); // SubClass.prototype = new SuperClass()

const ninja = new Ninja();

console.log(typeof ninja.dance); // ninja inherits person's prototype dance method

console.log(typeof Ninja); // function
console.log(typeof Ninja); // function
console.log(typeof Person); // function
console.log(ninja instanceof Ninja); // true
console.log(ninja instanceof Person); // true
console.log(ninja instanceof Object); // true

console.log('constructor' in ninja); // this returns true, but the constructor belongs to  Person function
