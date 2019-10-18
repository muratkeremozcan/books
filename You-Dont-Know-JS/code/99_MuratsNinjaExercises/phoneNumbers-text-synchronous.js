'use strict';
const fs = require('fs');
const fileRead = fs.readFileSync('C:/UserData/ozcanm/Documents/TRAINING/Books/JavaScript_Ninja/99_MuratsNinjaExercises/phoneNumbers.txt', 'utf-8');


// 3 ways to declare a regex pattern
const patternRegX = new RegExp (/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'g');
// let patternLiteral = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g;
// let patternRegXWithQuotes = new RegExp ('^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$', 'g');

const specialCharStripper = /[^\w]/g; // regex to eliminate anything that's not a letter or number

function findNumber(findPhoneNumber) {
  const inputNumber = findPhoneNumber.replace(specialCharStripper, '');
  return fileRead.split('\n')
    .filter(rawNumber => rawNumber.match(patternRegX)) // filter the array of phone numbers with regex
    .map(filteredNumber => filteredNumber.replace(specialCharStripper, '')) // create a new array w/o special chars
    .indexOf(inputNumber); // find the index of phone number input in any format
}
console.log(findNumber('+91 (977) 222-7890'));

module.exports = findNumber;

/*
  whitespace . -  optional
  3 digits
  whitespace  . -  optional
  4 digits
  valid:
  123-456-7890
  (123) 456-7890    // optional (3digits) ( ) are optional
  123 456 7890      // whitespace . -  optional
  123.456.7890      // whitespace . -  optional
  +91 (123) 456-7890 // optional + and 2digits followed by whitespace
  Invalid:
  180055512345       // Too many digits
  1 800 5555 1234    // Prefix code too long
  +1 800 555x1234    // Invalid delimiter
  +867 800 555 1234  // Country code too long
  1-800-555-1234p    // Invalid character
  1 (800)  555-1234  // Too many spaces
  800x555x1234       // Invalid delimiter
  86 800 555 1212    // Non-NA country code doesn't have +
*/
