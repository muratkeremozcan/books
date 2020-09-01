import {uncurry} from '../fp-tool-belt';
import {partialRight} from './5.2_partial-add_reverseArgs-KEY';


// convenience to avoid any potential binding issue with trying to use ` console.log ` as a function
function output(txt) {
  console.log(txt);
}

function printIf(predicate, msg) {
  if (predicate(msg)) {
    output(msg);
  }
}

function isShortEnough(str) {
  return str.length <= 5;
}
var msg1 = 'Hello';
var msg2 = msg1 + ' World';

printIf(isShortEnough, msg1);
printIf(isShortEnough, msg2);

// negation helper (complement() in FP libraries)
export function not(predicate) {
  return function negated(...args) {
    return !predicate(...args);
  };
}
var not_arrow = predicate => (...args) => !predicate(...args);

var isLongEnough = not(isShortEnough);
printIf(isLongEnough, msg2);


// refactor printIf to be point free
function when(predicate, fn) {
  return function conditional(...args) {
    if (predicate(...args)) {
      return fn(...args);
    }
  };
}


var when_arrow = (predicate, fn) =>
  (...args) => 
  predicate(...args) ? fn(...args) : undefined;

// we right-partially-applied the output method as the second (fn) argument for when(..), 
// which leaves us with a function still expecting the first argument (predicate). 
// That function when called produces another function expecting the message string; 
// it would look like this: fn(predicate)(str). 
// A chain of multiple (two) function calls like that looks an awful lot like a curried function, 
// so we uncurry(..) this result to produce a single function that expects the two str and predicate arguments together, 
// which matches the original printIf( predicate, str) signature.
var printIf_pointFree = uncurry(partialRight(when, output));

printIf_pointFree(isShortEnough, msg1);
printIf_pointFree(isLongEnough, msg1);