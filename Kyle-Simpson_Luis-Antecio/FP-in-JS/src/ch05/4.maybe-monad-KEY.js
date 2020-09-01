// Maybe monad is used to consolidate null checks. Branches to 2.
// Just : defined value
// Nothing : no value, or failure, where no additional info is needed. Can still apply function over its nonexistent value.

// Maybe is frequently used in calls that have uncertainty 

const Maybe = require('../../model/monad/Maybe.js').Maybe;
const R = require('ramda');
const db = require('../ch04/student-helper').db;
const Student = require('../../model/Student.js').Student;
const Address = require('../../model/Address.js').Address;

// simple instantiation with of
Maybe.of('Hello Maybe'); //?
Maybe.of('Hello Maybe').map(R.toUpper); //?

// getOrElse is an alternative to returning default values.
Maybe.of('Hello Maybe').map(R.toUpper).getOrElse(); //?

// Maybe.fromNullable is useful because it handles the null-checking on your behalf
// getOrElse is used to extract the value, or output the error message
Maybe.fromNullable('Hello Maybe').getOrElse(); //?
Maybe.fromNullable(null); //?
Maybe.fromNullable(null).getOrElse(); //?
Maybe.fromNullable(undefined); //?
Maybe.fromNullable(undefined).getOrElse(); //?

Maybe.fromNullable('Hello Maybe').isNothing; //?
Maybe.fromNullable('Hello Maybe').isJust; //?

Maybe.fromNullable(null).isNothing; //?
Maybe.fromNullable(null).isJust; //?


// 3 steps of Maybe monad usage:
// (1) wrap/containerize the value with .of(). If you want to secure the value against null, use fromNullable() instead.
// (2) use map() to apply functions to the value
// (3) use getOrElse() & value to get the value out (in contrast to join() and get() with Wrapper monad)
// KEY advantage over Wrapper monad: Maybe monad allows to propagate an invalid value up the composition


// from ch04 2.2.curry-student-example.js
const findStudentById = (db, id) => db.find(id);

const findStudent = R.curry((db, ssn) =>
  Maybe.of(findStudentById(db, ssn)) // can use fromNullable instead of of()
);

const getAddress = student =>
  Maybe.fromNullable(student.map(R.prop('_address')))


// replicate previous examples of wrapMonad
getAddress(findStudent(db, 11)); //?
getAddress(findStudent(db, 11))
  .getOrElse('blow up')
  .value //?

R.compose(
  getAddress,
  findStudent
)(db, 11)
  .getOrElse('blow up')
  .value //?


// KEY: Maybe monad allows to propagate an invalid value up the composition
const getCountry = student => student
  .map(R.prop('address'))
  .map(R.prop('country'))
  .getOrElse('Country does not exist!');

let address = new Address('USA');
let student = new Student('444-44-4444', 'Joe', 'Smith', 'Harvard', 1960, address);

getCountry(Maybe.fromNullable(student)); //?
  
student = new Student('444-44-4444', 'Joe', 'Smith', 'Harvard', 1960, null);
getCountry(Maybe.fromNullable(student)); //?