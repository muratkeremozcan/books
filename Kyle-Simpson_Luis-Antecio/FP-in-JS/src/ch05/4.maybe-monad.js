// Maybe monad is used to consolidate null checks
// it is basically an abstract umbrella object for the concrete monadic structures Just and Nothing
// it is frequently used in calls that have uncertainty

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
Maybe.fromNullable('Hello Maybe').getOrElse(); //?
Maybe.fromNullable(null); //?
Maybe.fromNullable(null).getOrElse(); //?
Maybe.fromNullable(undefined); //?
Maybe.fromNullable(undefined).getOrElse(); //?


// from ch04 2.2.curry-student-example.js
const findStudentById = (db, id) => db.find(id);

const findStudent = R.curry((db, ssn) =>
  Maybe.of(findStudentById(db, ssn))
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


// maybe allows to propagate an invalid value up the composition
const getCountry = student => student
  .map(R.prop('address'))
  .map(R.prop('country'))
  .getOrElse('Country does not exist!');

let address = new Address('USA');
let student = new Student('444-44-4444', 'Joe', 'Smith', 'Harvard', 1960, address);

getCountry(Maybe.fromNullable(student)); //?
  
student = new Student('444-44-4444', 'Joe', 'Smith', 'Harvard', 1960, null);
getCountry(Maybe.fromNullable(student)); //?