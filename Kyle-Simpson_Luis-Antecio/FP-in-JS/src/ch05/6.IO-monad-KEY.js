// With IO, you can’t avoid mutations or fix the problem of side effects, 
// but you can at least work with IO operations as if they were immutable from the application point of view.
// This can be done by lifting IO operations into monadic chains and letting the monad drive the flow of data.
// We achieved this in the previous example. What does IO monad bring to the table?

// IO monad wraps an effect function instead of a value; remember, a function can be thought of as a lazy value, waiting to be computed. 
// With this monad, you can chain together even DOM operations to be executed in a single “pseudo” referentially transparent operation 
// and ensure that side effect–causing functions don’t run out of order or between calls.

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


// previous example
const showStudentCompose = R.compose(
  map(R.tap(console.log)),
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudent),
  chain(checkLengthSsn),
  lift(cleanInput)
)
// showStudentCompose('22'); //?


// what does IO Monad do for us? Instead of a value, it wraps a 'lazy value' (in the form of a function)
// this way, it's ensured that side effect causing functions don't run out of order between calls. 
// Think of it like a gatekeeper against possible asynchrony

const IO = require('../../model/monad/IO.js').IO;
/** lifts the function into a monad. Initial requirement for the first function in the composition*/
const liftIO = val => IO.of(val);

const append = R.curry(function (element, info) {
  console.log('Simulating side effect. Appending: ' + info);
  console.log('the element is : ' + element);
  return info;
});


const showStudentIO = R.compose(
  map(append('student info:')),
  liftIO,
  getOrElse('unable to find student'), // great for outputting the value (hence IO)
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudent),
  chain(checkLengthSsn),
  lift(cleanInput)
)


// Incorporating the IO monad allows you to achieve something truly amazing. 
// running showStudent(ssn) now runs through all the logic of validating and fetching the student record.
//  Once this completes, the program waits on you to write this data to the screen. 
// we execute the IO monad with run, which kicks off the lazily initialized chain to perform the IO

showStudentIO('11').run(); //?
showStudentIO('222').run(); //?


// conclusion:
// Composition controls program flow (curry enables composition. Composition is better than chaining because of its flexibility not depending on the initial object in the chain)
// Monads control the data flow (takes care of the error handling)
// With these, once the business logic is done, IO monad delivers the data 

// the non-functional version on the other had is 
// has side effects
// lacks modularity
// imperative error handling
// difficult to use and test