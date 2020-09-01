// shortcut fusion is a function-level optimization that can merge the execution of some functions into one 
// and condense the number of internal data structures used to compute intermediate results.
// Creating fewer data structures lowers the excess memory needed when processing large collections.

import _ from 'lodash';
import R from 'ramda';
let square = x => Math.pow(x, 2);
let isEven = x => x % 2 === 0;
const numbers = _.range(200);

const result =
  _.chain(numbers)
  .map(square) 
  .filter(isEven)
  // behind the scenes, shortcut fusion allows the subsequent calls to map and filter to fuse into compose(filter(isEven), map(square))
  .take(3) // process only the first 3 numbers imposed by map and filter, instead of going through the whole 200 numbers
  .value(); //?

result.length; //?



