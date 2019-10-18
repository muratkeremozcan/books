var assert = require('assert');

var puppet = { // creates our own object with a property
  rules: false
}

// IMPORTANT: constructors start with an uppercase character to denote it's a Class
function Emperor() { // returns the above object despite initializing the new object as this
  this.rules = true; // initialization is for naught
  return puppet;
}
// ES6 version
class EmperorES6 {
  constructor() {
    this.rules = true;
    return puppet;
  }
}
var emperor = new Emperor(); // invokes the constructor
var emperorES6 = new EmperorES6(); // invokes the constructor
// object returned by the constructor is assigned to PUPPET, and not THIS
// LESSON: if the constructor returns an object, that object is returned as the value of the NEW expression. THIS is discarded
//         if the constructor does not return an object, the newly created object is returned
assert(emperor === puppet, 'emperor is not a puppet');
assert(emperor.rules === false, 'emperor does rule');

assert(emperorES6 === puppet, 'emperor is not a puppet');
assert(emperorES6.rules === false, 'emperor does rule');

console.log(emperor);
console.log(Emperor());

console.log(emperorES6);
console.log(EmperorES6()); // IMPORTANT: ES6 disallows constructor functions from being invoked as regular functions