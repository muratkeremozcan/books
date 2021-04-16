const Either = require('../../model/monad/Either.js').Either;
const Maybe = require('../../model/monad/Maybe.js').Maybe;
const R = require('ramda');
const db = require('../ch04/student-helper').db;



// 3 steps of Either monad usage:
// (1) wrap/containerize the value with .of(). If you want to secure the value against null or undefined, use fromNullable() instead.
// (2) use Either functions which very similar to Maybe; map, getOrElse etc. Use chain which is map() + autoFlatten (map+join)
// (3) specify the error case with Either.left
// KEY advantage over Wrapper monad: Either/Maybe monads allow to propagate an invalid value up the composition
// KEY difference of Either with Maybe: Either allows results to propagate while holding the possible errors. Maybe does not care for errors.


const validLength = (len, str) => str.length === len;
const find = R.curry((db, id) => db.find(id));

const safeFindObject = R.curry((db, id) => {
  const val = find(db, id);
  return val ? Either.right(val) : Either.left(`Object not found with ID: ${id}`); // (3)
  // return val ? Maybe.just(val) : Maybe.nothing(`Object not found with ID: ${id}`); // Either comparison to Maybe
})

const checkLengthSsn = ssn => 
validLength(2, ssn) ? Either.right(ssn) : Either.left('invalid SSN');  // (3)
// validLength(2, ssn) ? Maybe.just(ssn) : Maybe.nothing('invalid SSN'); // Either comparison to Maybe

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



// (1) make sure the first function to be executed wraps its result in a proper monad: both Maybe and Either work in this case.
// (#)think of .chain as shortcut to avoid using join after map to flatten the layers from combining monad-returning functions
const showStudent = ssn => Maybe.fromNullable(ssn)
  .map(cleanInput) // takes care of invalid data format  // (2) ...
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


/////
// in FP, you either want to chain or compose(or pipe) at the end. How do you compose the same thing?
// to compose, you need the curry versions of the same functions
// why do you want to compose/pipe vs chain?
// - Chaining methods together (tightly coupled, limited expressiveness). Makes tight connections via an object’s methods, (with Monad, this is not as much of a concern)
// - Arranging function compose or pipe (loosely coupled, flexible). Provides the flexibility to combine any set of functions, 
// because it links inputs and outputs of any functions—arriving at loosely coupled components.

// KEY
/** takes a function and a monad, using the monad.map method, maps the function further*/
const map = R.curry((f, container) => container.map(f));
/** Think of chain as map + join (map & auto-flatten). Takes a function and a monad, using the monad.chain method, chain the function further */
const chain = R.curry((f, container) => container.chain(f));
/** Takes care of the initial requirement that the first function to be executed wraps its result in a monad (Either or Maybe), */
const lift = R.curry((f, obj) => Maybe.fromNullable(f(obj)));
/** used for outputting to console */
const trace = R.curry((msg, obj) => console.log(msg));

// instead of this ugliness... you can compose
// lift(cleanInput)('22'); //?
// chain(checkLengthSsn)((lift(cleanInput)('22'))); //?
// chain(findStudent)(chain(checkLengthSsn)((lift(cleanInput)('22')))); //?
// map(R.props(['ssn', 'firstname', 'lastname']))(chain(findStudent)(chain(checkLengthSsn)((lift(cleanInput)('22'))))); //?
// map(csv)(map(R.props(['ssn', 'firstname', 'lastname']))(chain(findStudent)(chain(checkLengthSsn)((lift(cleanInput)('22')))))); //?

const showStudentCompose = R.compose(
  // R.tap(trace('Student printed to the console')),
  map(R.tap(console.log)),
  // R.tap(trace('Student info converted to CSV')),
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  // R.tap(trace('Record fetched successfully!')),
  chain(findStudent),
  // R.tap(trace('input was valid')), // purely for outputting to console
  chain(checkLengthSsn),
  lift(cleanInput)
)

showStudentCompose('22'); //?


// with pipe
const showStudentPipe = R.pipe(
  lift(cleanInput),
  chain(checkLengthSsn),
  chain(findStudent),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  map(csv),
  map(R.tap(console.log))
)

showStudentPipe('22'); //?
