import { compose, identity } from '../fp-tool-belt'
import R from 'ramda';
import _ from 'lodash';
// or 
// const R = require('ramda');
// const _ = require('lodash');

const printToConsole = str => {
  console.log(str)
  return str;
}

const toUpperCase = str => str.toUpperCase();

const repeat = times => (str = '') => {
  let tokens = [];
  for (let i = 0; i < times; i++) { // for (let i of new Array(times)){ // or this
    tokens.push(str);
  }
  return tokens.join(' ');
}


const printMessage = compose(printToConsole, repeat(3), toUpperCase, identity)
const printMessage_R = R.compose(printToConsole, repeat(3), toUpperCase, R.identity)

printMessage('hello world'); //?
printMessage_R('hello world'); //? 

	