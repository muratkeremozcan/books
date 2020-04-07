import { compose, identity } from '../fp-tool-belt'
// can use our own or ramda library
const R = require('ramda'); 

const printToConsole = str => {
  console.log(str)
  return str;
}
const toUpperCase = str => str.toUpperCase();


const printMessage = compose(printToConsole, toUpperCase, identity);
printMessage('hello world'); //?
// first we execute identity('hello world')
// we get that result and execute toUpperCase :  toUpperCase(identity('hello world'))
// the we do the same for printToConsole :  printToConsole(toUpperCase(identity('hello world')));

// we can do the same with Ramda library
const printMessage_R = R.compose(printToConsole, toUpperCase, R.identity);
printMessage_R('hello ramda'); //?

