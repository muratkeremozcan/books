// 7.5 typeof object instance and the object's constructor
function Ninja() {}
const ninjaOrg = new Ninja();

console.log(typeof Ninja); // function
console.log(typeof ninjaOrg); // object
console.log(ninjaOrg instanceof Ninja); // true
console.log(ninjaOrg.constructor === Ninja); // the object was created by the function

// 7.6 instantiating an object using a reference to a constructor
const ninja = new Ninja();
const ninja2 = new ninja.constructor(); // use the constructor property to construct a 2nd ninja from the first ninja

console.log(ninja2 instanceof Ninja); // new object is an instance of Ninja
console.log(ninja !== ninja2); // they are not the same object, but two distinct instances