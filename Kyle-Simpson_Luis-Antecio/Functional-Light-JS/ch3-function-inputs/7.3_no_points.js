// FP style to reduce unnecessary parameter-argument mapping.
// The key thing to look for is if you have a function with parameter(s) 
// that is/are directly passed to an inner function call


import {unary} from '../fp-tool-belt';


[1, 2, 3, 4, 5].map(function mapper(v) {
  return v*2;
}); //?

function double(x) {
  return x*2;
}
// point-free style
[1, 2, 3, 4, 5].map(double); //?


// ex 2
['1', '2', '3'].map(function mapper(v) {
  return parseInt(v);
}); //?
// point-free style
['1', '2', '3'].map(unary(parseInt)); //?

