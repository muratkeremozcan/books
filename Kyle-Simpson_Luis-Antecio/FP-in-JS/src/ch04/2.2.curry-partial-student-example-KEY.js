// similar to the example in ch01/1.3_1.4_side-effects_to_curry-compose-KEY, just a little more explicit.

import R from 'Ramda';
const curry = R.curry;
const compose = R.compose;
const db = require('./student-helper').db;

const findStudentById = (db, id) => db.find(id);
// findStudentById(db, 11); //?


// currying a function allows to pass to arguments later
const find = curry(findStudentById);
// find(); //?
// find()(db)(11); //?
// find()(db, 11); //?


/** just an advanced finder */
const findObject = (db, id) => {
  const obj = find(db,id);
  if (obj === null) {
    throw new Error(`Object with Id ${id} not found`);
  }
  return obj;
};
// findObject(db, 22); //?


// curry magic: we have 1 function that uses findObject, the next one is specialized to use a certain db
const findObject_curried = curry(findObject);
const findStudent = findObject_curried(db);
// this way, we can pass the id argument later...
// findStudent(11); //?


/** given an object, outputs the values */
const outPutter = ({ ssn, firstname, lastname }) => `${ssn}, ${firstname}, ${lastname}`; 
// const outPutter = student => `${student.ssn}, ${student.firstname}, ${student.lastname}`; // same thing

// so far we can get an object, we can output it, and we can compose the 2 in a pipeline
findStudent('11'); //?
outPutter({'ssn': '222-22-222', 'firstname': 'hola', 'lastname':'madre'}); //?
compose(outPutter, findStudent)(11); //?


// prepend expects 2 arguments. Info is all we need, but we also want to prepend a header
// this way, we only output when 2 arguments exist: a header + the info which passed in from the compose pipeline
// we are going to get header & info arguments in runtime, after having defined this function
const prependSimple = (header, info) => { 
  console.log(header, info);
  return info;
};
// just returns the info also outputs  header + info
prependSimple('222-22-222', 'hola'); //?
// we make it so that args can be passed in later
const prependHeader = curry(prependSimple);


// being able to reduce the arity with curry enables us to compose like this
// with curry, we make it so that the argument can be passed in later
// with compose, we move that argument from function to function
const showStudent = compose(
  prependHeader('#student-info:'),
  outPutter,
  findStudent
);
showStudent(11); //?


// Functional programming removes the limitations present in method chaining and provides the flexibility to combine any set of functions.
// Chaining makes tight connections via an object’s methods, 
// whereas a pipeline links inputs and outputs of any functions—arriving at loosely coupled components. 
// But for this linkage to be possible, the connecting functions must be compatible in terms of arity and type
// We address arity with currying, with type we need to be careful

const trim = (str) => str.replace(/^\s*|\s*$/g, '');
const normalize = (str) => str.replace(/\-/g, '');

const showStudentAdvanced = compose(
  prependHeader('#student-info:'),
  outPutter,
  findStudent,
  normalize,
  trim
);
showStudentAdvanced('33'); //?





/// can it be done with partial?
// partial has a very niche use over curry; if there are arguments that are guaranteed, you can use partial

// Ramda partial is weird; every string char is treated as an argument. Use lodash.
import _ from 'lodash';

// since we want the header fixed, why not pre-specify it?
const prependPartialHeader = _.partial(prependSimple, '#student-info:'); //?
// contrast: prependHeader = curry(prependSimple);

// when the argument comes in, partial outputs them together
prependPartialHeader({'ssn': '222-22-222', 'firstname': 'hola', 'lastname':'madre'}); //?

compose(
  prependPartialHeader, // cleaner this way, no need to pass in that header argument
  outPutter,
  findStudent
)(33) ; //?

