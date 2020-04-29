const Either = require('../../model/monad/Either.js').Either;
const Maybe = require('../../model/monad/Maybe.js').Maybe;
const R = require('ramda');
const db = require('../ch04/student-helper').db;


const validLength = (len, str) => str.length === len;
const find = R.curry((db, id) => db.find(id));
const safeFindObject = R.curry((db, id) => {
  const val = find(db, id);
  return val ? Either.right(val) : Either.left(`Object not found with ID: ${id}`);
  // return val ? Maybe.just(val) : Maybe.nothing(`Object not found with ID: ${id}`);
})
const checkLengthSsn = ssn => 
validLength(2, ssn) ? Either.right(ssn) : Either.left('invalid SSN');
// validLength(2, ssn) ? Maybe.just(ssn) : Maybe.nothing('invalid SSN');
const findStudent = safeFindObject(db);
const csv = arr => arr.join(','); //?
const trim = (str) => str.replace(/^\s*|\s*$/g, '');
const normalize = (str) => str.replace(/\-/g, '');
const cleanInput = R.compose(normalize, trim);

// safeFindObject(db, 'xx'); //?
// checkLengthSsn('999999999'); //?
// findStudent('22'); //?

// we use Either in the functions because we want the results to propagate while holding the possible errors
// (remember: unlike Maybe.Nothing, Either.Left can contain values to which functions can be applied.)
// we use Maybe at the top, because at that point we do not need additional info on failures.(But, we could just use Either as well).

// remember:the key difference with Maybe: Either allows results to propagate while holding the possible errors. Maybe does not care for errors.
// you can replace the Either s with Maybe s and will instead see Nothing s { } for error messages.

const showStudent = ssn => Maybe.fromNullable(ssn)
  .map(cleanInput) // takes care of invalid data format
  .chain(checkLengthSsn) // takes care of invalid data length
  .chain(findStudent) // takes care of errors with finding the data
  .map(R.props(['ssn', 'firstname', 'lastname'])) // this and the rest does the outputting
  .map(csv)
  .map(R.tap(console.log))
  ; //?


showStudent('22'); //?
// checks against invalid data format
showStudent('333'); //?
// checks against data not existing
showStudent('55'); //?
