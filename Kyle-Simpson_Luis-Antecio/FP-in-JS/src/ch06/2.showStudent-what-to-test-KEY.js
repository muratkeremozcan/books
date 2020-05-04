// testing in FP is easy since you only worry about the business logic, but impurity is the challenge. How do you address it?
// interacting with the DOM in the front end, in the back end interacting with the server introduce impurity.
// IO monad pushes the impurity away achieving referential transparency from the app's perspective.
// Either and Maybe monads ensure the app to be responsive even in the event of failure.

// testing the showStudent example 

const _ = require('lodash');
const R = require('ramda');
const Either = require('../../model/monad/Either.js').Either;
const Maybe = require('../../model/monad/Maybe.js').Maybe;
const IO = require('../../model/monad/IO.js').IO;
const db = require('../ch04/student-helper').db;

const validLength = (len, str) => str.length === len;
const find = R.curry((db, id) => db.find(id));
const safeFindObject = R.curry((db, id) => {
  const val = find(db, id);
  return val ? Either.right(val) : Either.left(`Object not found with ID: ${id}`);
})
const findStudent = safeFindObject(db);
const checkLengthSsn = ssn =>
  validLength(2, ssn) ? Either.right(ssn) : Either.left('invalid SSN');
const csv = arr => arr.join(','); //?
const trim = (str) => str.replace(/^\s*|\s*$/g, '');
const normalize = (str) => str.replace(/\-/g, '');
const cleanInput = R.compose(normalize, trim);
/** takes a function and a monad, using the monad.map method, maps the function further*/
const map = R.curry((f, container) => container.map(f));
/** Think of chain as map + join (map & auto-flatten). Takes a function and a monad, using the monad.chain method, chain the function further */
const chain = R.curry((f, container) => container.chain(f));
/** Takes care of the initial requirement that the first function to be executed wraps its result in a monad (Either or Maybe), */
const lift = R.curry((f, obj) => Maybe.fromNullable(f(obj)));
/** used for outputting to console */
const trace = R.curry((msg, obj) => console.log(msg));
/** Extracts the Right value. If it doesn't have one, returns the given default. */
const getOrElse = R.curry((message, container) => container.getOrElse(message));
/** lifts the function into a monad. Initial requirement for the first function in the composition*/
const liftIO = val => IO.of(val);
const append = R.curry(function (element, info) {
  console.log('Simulating side effect. Appending: ' + info);
  console.log('the element is : ' + element);
  return info;
});


// identify the testable areas of showStudent
// the components that perform IO are impure and cannot be tested reliably because of side effects
// the rest is testable

const showStudentIO = R.compose(
  map(append('student info:')), // append is impure, because it outputs to the console. Leave testing DOM apis to browser manufacturers
  liftIO, // FP construct, no need to test
  getOrElse('unable to find student'), // FP construct, no need to test
  map(csv), // csv is pure, testable
  map(R.props(['ssn', 'firstname', 'lastname'])), // FP construct, no need to test
  chain(findStudent), // impure (can have error with Either.left case), but can be tested by other means (sinon mock)
  chain(checkLengthSsn), // checkLengthSsn is pure, testable
  lift(cleanInput) // cleanInput is pure, testable
)
// showStudentIO('11').run(); //?

// The fact that functional code is orders of magnitude more testable than imperative code boils down to one principle: referential transparency. 
// The essence of an assertion is verifying that referential transparency always holds


// test cleanInput
cleanInput('-44-44'); //?
// with Jest
/*
const input = ['', '-44-44-', '44444', ' 4 ', ' 4-4 '];
const assertions = ['', '4444', '44444', '4', '44'];


input.forEach(function (val, key) {
  expect(cleanInput(val)).toEqual(assertions[key]);
});
*/


// test checkLengthSsn (wants 2 digit ssn)
checkLengthSsn('44').isLeft; //?
checkLengthSsn('44').isRight; //?
checkLengthSsn('444444444').isLeft; //?
checkLengthSsn('').isLeft; //?
checkLengthSsn('44').chain(R.length); //?
// note: similar with Jest, check Luis' Jest test


// test csv (not sure if it's really needed to test, just does an array.join)
csv(['']); //?
csv(['Alonzo']); //?
csv(['Alonzo', 'Church']); //?
csv(['Alonzo',  '', 'Church']); //?


// conclusion
// With functional programming, you can take a hard-to-test program and split it into highly testable pieces.
// compare this against the nonfunctional, tightly coupled code in listing 6.2. 
// In the functional version, you’re able to test roughly 90% of the program reliably, 
// whereas the imperative version has the same fate as the procedural increment function — it fails on subsequent or out-of-order runs.


// mocking external dependencies
// findStudent has an external dependency because it reaches the db. The DB can have anything. How do you get around this?
// Sinon.JS enhances the test environment with a sinon object used to create mock versions of any object, all accessible in a mock context. 
// In this case, you populate the context with the db object, which will serve as the acting stub for this dependency:
 

// the test framework can differ, but the idea is the same. You can look at Luis's Qunit example for working code.


// const studentStore = require('../ch04/student-helper').db;
// const mockContext = sinon.mock(studentStore);

findStudent('xxx-xxx').isLeft; //?
findStudent('44').isRight; //?

// you can  assert things like how many times it’s called, what arguments it receives, as well as what its return value should be.
// expect find() to be called and return something...
// mainly, for findStudent, you want to validate the behavior of the Either monad, triggering left and right sides


/* 
mockContext.expects('find').once().returns(null);
assert.ok(findStudent('xxx-xx-xxxx').isLeft);	
*/

/*
mockContext.expects('find').once().returns (
  new Student('444-44-4444', 'Alonzo', 'Church', 'Princeton')
);
assert.ok(findStudent('444-44-4444').isRight);
*/


// note about property based testing with JSCheck
// A property-based test makes a statement about what the output of a function should be when executed against a definite set of inputs.
// The main advantage of using a tool like JSCheck is that its algorithm generates abnormal data sets to test with. 
// Some of the edge cases it generates would most likely be overlooked if you had to manually write them.
// check out Luis' code on how to use it.
