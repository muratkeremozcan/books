// INHERITANCE PRE ES6
function Person(name) {
  this.name = name;
}
Person.prototype.dance = function(){}; // every function has a PROTOTYPE object we can modify
function Ninja(){}
Ninja.prototype = new Person(); // SubClass.prototype = new SuperClass()
// IMPORTANT: when setting inheritance with the above, constructor property gets messed up for Ninja, because it's at Person
// IMPORTANT: so we fix the constructor property of Ninja
Object.defineProperty(Ninja.prototype, "constructor", { // Object.defineProperty method (object, "name of property" , {attributes of property})
  enumerable: false,
  value: Ninja,
  writable: true
});

// INHERITANCE IN ES6 : the advantage is not having to think about side effects of overriding the constructor property of the child ( no need to do the Object.defineProperty juju )
class PersonClass {
  constructor(name) {
    this.name = name;
  }
  dance(){
    return true;
  }
}
class NinjaClass extends PersonClass { // uses the EXTENDS keyword to inherit from another class
  constructor(name, weapon) {
    super(name); // uses the SUPER keyword to call the base class constructor. THIS MAKES EVERYTHING HAPPEN. must call with 1 argument, any argument works
    this.weapon = weapon;
  }
  wieldWeapon() {
    return true;
  }
}

var person = new PersonClass("Bob");

console.log(person instanceof PersonClass);
console.log(person.dance()); // the class instance has access to the methods of the class
console.log(person.name); // the class instance has access to the constructor property
console.log(person instanceof Ninja); // it's not an instance of the sub class
// console.log(person.wieldWeapon()); // parent class cannot access child class's method

var ninja = new NinjaClass("Yoshi", "Wakizashi");
console.log(ninja instanceof PersonClass);
console.log(ninja instanceof NinjaClass);
console.log(ninja.dance()); // the class instance has access to the methods of the PARENT class
console.log(ninja.wieldWeapon()); // the child class instance has access to the methods of its own class
console.log(ninja.name); // the class instance has access to the constructor property


