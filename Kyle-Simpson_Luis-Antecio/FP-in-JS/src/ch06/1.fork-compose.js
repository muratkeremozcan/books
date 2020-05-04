const _ = require('lodash');
const R = require('ramda');

/* main idea in FP:
break down the problem to small parts
glue them together, using libs like Ramda and Lodash (curry, compose etc.)
as needed, use functional combinators for control flow  (identity, tap, alternation, sequence, fork, join)
easily test, only worrying about the business logic
*/


// function combinators are a utility for control flow 
// they are higher-order functions that can combine primitive artifacts like other functions (or other combinators) and behave as control logic.
/** process a single resource (val) in two different ways (f1, f2) and then combine the results */
const fork = (join, func1, func2) => val => join(func1(val), func2(val));

fork(R.divide, R.sum, R.length)([80, 90, 100, 110]); //?
const timesTwo = fork(x => 2 * x, R.identity, R.identity);
timesTwo(3); //?


/** converts the grade score to letter */
const toLetterGrade = (grade) => {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};


const computeAverageGrade = R.compose(
  toLetterGrade,
  fork(R.divide, R.sum, R.length)
);

// the only thing that needs to be tested at the end is the business logic
// because Ramda is tested as a library, and fork is a functional combinator which you don't need to test
computeAverageGrade([80, 90, 100, 70]); //?