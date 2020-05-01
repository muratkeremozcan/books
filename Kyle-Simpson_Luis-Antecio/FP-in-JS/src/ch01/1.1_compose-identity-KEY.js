// can use our own or ramda library
import { compose, identity } from '../fp-tool-belt'
import R from 'ramda'; 
// const R = require('ramda'); // or this

const printToConsole = str => {
  console.log(str)
  return str;
}
const toUpperCase = str => str.toUpperCase();


// first we execute: identity('hello world')
identity('hello world'); //?

// we get that result and execute toUpperCase :  
toUpperCase(identity('hello world')); //?

// the we do the same for printToConsole :  
printToConsole(toUpperCase(identity('hello world'))); //?


const printMessage = compose(printToConsole, toUpperCase, identity);
printMessage('hello world'); //?

// we can do the same with Ramda library
const printMessage_R = R.compose(printToConsole, toUpperCase, R.identity);
printMessage_R('hello ramda'); //?

