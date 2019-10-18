var assert = require('assert');

var outerValue = "samurai";
var later; // empty var for later use

function outerFunction() {
  var innerValue = "ninja"; // This var's scope is only inside the function, no access from outside

  function innerFunction() { // the innerFunction's scope is only inside the outerFunction, no access from outside
    assert(outerValue === 'samurai', 'error: inner function cannot access outerValue variable');
    assert(innerValue === 'ninja', 'error: inner function cannot access innerValue variable');
  }
  later = innerFunction; // TRICK: store a reference to innerFunction in the later variable
}
// BREAK IT: if you switch the places of these two, it will error out, because innerFunction reference will not yet be assigned: there will be no closure for innerFunction
outerFunction(); // invokes outerFunction, causes innerFunction to be created and its reference to be assigned to later
later(); // TRICK: here we are executing innerFunction after outerFunction by COPYING A REFERENCE to the innerFunction, to a GLOBAL VARIABLE (var later)
