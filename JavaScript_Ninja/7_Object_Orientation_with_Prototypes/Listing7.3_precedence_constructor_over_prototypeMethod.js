var assert = require('assert');
function Ninja() {
  this.swung = false; // creates an instance variable that holds a boolean value
  this.swingSword = function() { // creates an instance method that accesses the inverse of the boolean value
    return !this.swung; // takes precedence (true)
  }
}
Ninja.prototype.swingSword = function() { // PROTOTYPE METHOD with the same name as the instance method
  return this.swung; // ineffective over instance method  (false)
}

const ninja = new Ninja(); // when we access property swingSword on ninja, there's no need to traverse the prototype chain
console.log(ninja.swingSword()); // the property found within the constructor is immediately found and returned, takes priority over prototype