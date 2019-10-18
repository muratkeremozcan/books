// COMPARE TO 7.8_Inheritance_with_prototypes
function Person() {}
Person.prototype.dance = function(){};
function Ninja() {}
Ninja.prototype = new Person(); // SubClass.prototype = new SuperClass()
// when we set Person as the superClass of Ninja, we loose the original Ninja prototype that keeps its constructor property
// we do not want to lose the constructor property, because it's useful for determining the function used to create our object instances
// we can solve this problem by defining a new constructor property on the Ninja.prototype

// Object.defineProperty method (object, "name of property" , {attributes of property})
D(Ninja.prototype, "constructor", {
  enumerable: false,
  value: Ninja, // change this to test
  writable: true
});

var ninja = new Ninja();

console.log(ninja.constructor);

for (let prop in Ninja.prototype) { // the constructor is not enumerable and keeps value Ninja
  console.log(prop);
}

console.log(typeof Ninja); // function
console.log(typeof Ninja); // function
console.log(typeof Person); // function
console.log(ninja instanceof Ninja); // true
console.log(ninja instanceof Person); // true
console.log(ninja instanceof Object); // true

console.log('constructor' in ninja); // this returns true, but the constructor belongs to  Person function
