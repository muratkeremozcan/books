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

// this way, the problem is so much faster, and easy to reason about because the entire solution is succinct in one or two lines.
// also, the data is not mutated

// the hardest part is the exercise of breaking a task into smaller pieces; 
// once this is finalized, composition is compelling for recombining functions.



// optionally you can make this point free. Nicer read, but usability is not increased or decreased

const first = R.head;
const getNames = R.pluck(0);
const reverse = R.reverse;
const sortByGrade = R.sortBy(R.prop(1));
const combine = R.zip;

R.compose(
  first,
  getNames,
  reverse,
  sortByGrade,
  combine
)(students, grades); //?

R.pipe(
  combine,
  sortByGrade,
  reverse,
  getNames,
  first
)(students, grades); //?
