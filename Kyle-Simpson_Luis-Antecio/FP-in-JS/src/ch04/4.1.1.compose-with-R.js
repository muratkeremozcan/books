import R from 'ramda';
import _ from 'lodash';

let students = ['Rosser', 'Turing', 'Kleene', 'Church'];
let grades = [80, 100, 90, 99, 500];

// everything in the previous section

// all Ramda function are curried. 
// with curry, we make it so that the argument can be passed in to a curried function later
// with compose, we move that argument from function to function

// we have to watch out for equal number of arguments (arity) between the composed functions
// we have to watch out for types of these arguments

R.compose(
  R.head,
  R.pluck(0),
  R.reverse,
  R.sortBy(R.prop(1)),  
  R.zip,
)(students, grades); //?

// this way, the problem is so much faster, and easy to reason about