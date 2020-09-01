// Tuples are one way to reduce a function’s arity, but there’s a better alternative for cases in which tuples aren’t sufficient.
// same example from ch01/1.4_array-sort-compose-curry-KEY.js

import R from 'Ramda';
const compose = R.compose;
const curry = R.curry;
const pipe = R.pipe;

const descend = (a, b) => b - a;
const ascend = (a, b) => a - b;
const makeNum = arg => Number(arg);

const sortDescending = arr => arr.sort(descend);
const sortAscending = arr => arr.sort(ascend);
const makeArrNum = arr => arr.map(makeNum);

// with curry, we make it so that the argument can be passed in later
// with compose, we move that argument from function to function

const ages = [1, 10, 21, 2];

const curriedSortDesc = curry(sortDescending);
const curriedSortAsc = curry(sortAscending);
const curriedMakeArrNum = curry(makeArrNum);

compose(
  curriedSortAsc,
  curriedMakeArrNum
)(ages); //?

compose(
  curriedSortDesc,
  curriedMakeArrNum
)(ages); //?

// pipe makes it so that the flow goes top to bottom
pipe(
  curriedMakeArrNum,
  curriedSortDesc
)(ages); //?