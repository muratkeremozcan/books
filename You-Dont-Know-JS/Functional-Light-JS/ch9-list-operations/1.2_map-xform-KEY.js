///////////
// We can use map(..) to transform a list of functions into a list of their return values
let one = () => 1;
let two = () => 2;
let three = () => 3;

[one, two, three].map( fn => fn() ); //?

// we can first transform a list of functions by composing each of them with another function,
// and then execute them:
import { compose } from '../fp-tool-belt';

let increment = v => ++v;
let decrement = v => --v;
let square = v => v * v;
let double = v => v * 2;

[increment, decrement, square]
  .map( fn => compose(fn, double) )
  .map( fn => fn(3) ); //?
