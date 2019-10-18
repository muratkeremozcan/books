// what is a callback? passing a function to another function, that function later calls the passed-in function
var assert = require('assert');

var text = "Domo arigato!";
console.log('Before defining functions'); // CALLED FIRST
function useless(ninjaCallback) { // a function that takes a callback function...
  console.log('in useless function');  // CALLED 3rd
  return ninjaCallback();// ... and immediately invokes it
}
function getText() { // a function that takes a global variable
  console.log('In getText function');  // CALLED 4th
  return text; // .. and returns the variable
}
console.log('Before making all the calls'); // CALLED SECOND

// call useless function with the getText function as a callback
assert(useless(getText) === text, console.log('The useless function works ' + text)); // node assert is different
console.log('After the calls have been made'); // last