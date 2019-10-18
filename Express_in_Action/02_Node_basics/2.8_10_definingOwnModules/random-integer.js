var MAX = 100;

function randomInteger() {
  return Math.floor((Math.random() * MAX)); // Math.floor() returns the largest integer less than or equal to a given number : 5.95 -> 5
} // Math.random() function returns a floating-point, pseudo-random number in the range 0–1
// console.log(randomInteger());
module.exports = randomInteger;