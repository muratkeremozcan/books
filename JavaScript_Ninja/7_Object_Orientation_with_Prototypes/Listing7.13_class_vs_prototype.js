// PROTOTYPE
function Ninja(name) {
  this.name = name;
  function swingAxe(){ // you can modify the prototype or have functions in the original prototype
    return true;
  };
}
Ninja.prototype.swingSword = function() { // you can modify the prototype or have functions in the original prototype
  return true;
};
var ninja = new Ninja("Yoshi");
console.log(ninja.name);
console.log(ninja.swingSword);

// CLASS
// IMPORTANT: everything in a class definition is either a constructor, a method, or a static function.
// No need to spell out "function" when everything in a class already is
class NinjaClass {
  constructor(name) { // constructor function is used when we call the class with the keyword NEW
    this.name = name;
  }
  swingSword() { // additional method accessible to all instances
    return true;
  }
}
var ninjaClass = new NinjaClass("Yoshi in Class");
console.log(ninjaClass.name);
console.log(ninjaClass.swingSword);