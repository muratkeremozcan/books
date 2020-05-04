// function combinators are a utility for control flow 
// they are higher-order functions that can combine primitive artifacts like other functions (or other combinators) and behave as control logic.

import R from 'ramda';
const program = ['Functional', 'Programming', 'Curry', 'Memoization', 'Partial', 'Curry', 'Programming']


// identity function returns the argument it was called with
// Supplying data to higher-order functions that expect it when evaluating a function argument
R.identity(program); //?


// tap is useful to bridge void functions (such as logging or writing a file or an HTML page)
// into your composition without having to any create additional code
// because it throws away the return (which is void) 
R.tap(console.log)('Student printed to the console'); //?


// alternation takes two functions and returns the result of the first one if the value is defined (not false, null, or undefined); 
// otherwise, it returns the result of the second function.
const alternate = (func1, func2) => val => func1 ? func1(val) : func2(val);
const alt = R.curry((func1, func2, val) => func1 ? func1(val) : func2(val));

alternate(R.identity, null)(program); //?
alternate(R.identity, undefined)(program); //?
alt(R.identity)(null)(program); // nicer curried
alt(undefined, R.identity)(program); //? 
alt(null, R.identity)(program); //?


// the rest are covered later... Come back with working examples.

// sequence is used to loop over a sequence of functions - could not get a simple example to work
// const seq = (...funcs) => function (val) {
//   funcs.forEach(function (fn) {
//     fn(val);
//   });
// };

// const add = (x, y) => x + y;
// const mult = (x, y) => x * y;

// R.compose(
//   R.tap,
//   seq(
//     add,
//     mult
//   ),
// )(1, 2); //?


/** process a single resource (val) in two different ways (f1, f2) and then combine the results */
const fork = (join, func1, func2) => (val) => join(func1(val), func2(val));

// check whether the mean and median of a collection of grades are equal:
fork(R.equals, R.median, R.mean)([80, 90, 100]); //?
fork(R.equals, R.median, R.mean)([81, 90, 100]); //?