var assert = require ('assert');
function Ninja() {
  this.swung = true;
}

const ninja1 = new Ninja();

Ninja.prototype.swingSword = function() { // adds a method to the prototype after the object has been created
  return this.swung;
};

console.log(ninja1.swingSword()); // prototype can be modified on the go

Ninja.prototype = { // overrides the Ninja's prototype
  pierce: function() {
    return true;
  }
};

console.log(ninja1.swingSword()); // NEW: ninja1 object keeps a reference to the old ninja prototype, ninja1's prototype did not get modified

const ninja2 = new Ninja();
console.log(ninja2.pierce());
console.log(ninja2.swingSword);
assert(!ninja2.swingSword); // IMPORTANT: newly created Ninja instances have only the newly modified prototype