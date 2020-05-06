// how do you avoid computing repetitive values?
// in OOP systems, this is accomplished by placing a cache or proxy layer that’s checked before a function is called.
// A cache is an intermediary repository, or memory, that’s queried before an expensive operation. In web applications,

// check out the book for the implementation of cachedFn 
// cachedFn  acts as a proxy between the function execution and its result to ensure that the same function isn’t invoked twice.
// the problem with it is that you have to wrap every function call with a 'cachedFn' version
// the other issue is that it needs a global variable cache = {}, which becomes prone to side effects

// Memoization makes use of the function’s arguments to create a unique key with which to store the function’s result, 
// so that on subsequent invocations of the function with the same arguments, the stored result can be returned immediately.

// 2 ways to use memoization
// by wrapping the function definition :  (someFunction => ...).memoize
// by invoking a method on a function :    someFunction.memoize() 

require('./memoization');

/** encodes strings into ROT13 format (rotation of the 26 ASCII characters of the alphabet by 13 positions). 
 * It’s practical in web applications for hiding puzzle solutions and discount codes, muddling offensive material, and so on: */
const rot13 = (s =>
  s.replace(/[a-zA-Z]/g, c =>
    String.fromCharCode((c <= 'Z' ? 90 : 122)
      >= (c = c.charCodeAt(0) + 13) ? c : c - 26))).memoize();

rot13('functional_js_50_off'); //?

// 
const rot13_2 = s =>
  s.replace(/[a-zA-Z]/g, c =>
    String.fromCharCode((c <= 'Z' ? 90 : 122)
      >= (c = c.charCodeAt(0) + 13) ? c : c - 26));

rot13_2.memoized(('functional_js_50_off')); //?


// perf test of memoization

const IO = require('../../model/monad/IO.js').IO;
const now = require("performance-now")
const R = require('ramda');

const start = () => now();
const runs = [];
const end = function (start) {
  let end = now();
  let result = (end - start).toFixed(3);
  runs.push(result);
  return result;
};

const test = function (fn, input) {
  return () => fn(input);
};

const testRot13 = IO.from(start)
  .map(R.tap(test(rot13, 'functional_js_50_off')))
  .map(end);

testRot13.run(); //?
// 2nd one much shorter
testRot13.run(); //?



// check out memoization library https://www.npmjs.com/package/memoizee for memoizing functions with multiple arguments
// for single argument cases, currying + compose helps because the final result is a unary function


// memoize the showStudent function

const _ = require('lodash');
const Either = require('../../model/monad/Either.js').Either;
const Maybe = require('../../model/monad/Maybe.js').Maybe;
const db = require('../ch04/student-helper').db;

const validLength = (len, str) => str.length === len;
const find = R.curry((db, id) => db.find(id));
const safeFindObject = R.curry((db, id) => {
  const val = find(db, id);
  return val ? Either.right(val) : Either.left(`Object not found with ID: ${id}`);
})
export const findStudent = safeFindObject(db);
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
export const append = R.curry(function (element, info) {
  console.log('Simulating side effect. Appending: ' + info);
  console.log('the element is : ' + element);
  return info;
});

// KEY: memoized version of the functions.
const m_cleanInput = cleanInput.memoize(); 
const m_checkLengthSsn = checkLengthSsn.memoize();
const m_findStudent = findStudent.memoize();


// identify the testable areas of showStudent
// the components that perform IO are impure and cannot be tested reliably because of side effects
// the rest is testable

export const showStudentIO = R.compose(
  map(append('student info:')), // append is impure, because it outputs to the console. Leave testing DOM apis to browser manufacturers
  liftIO, // FP construct, no need to test
  getOrElse('unable to find student'), // FP construct, no need to test
  map(csv), // csv is pure, testable
  map(R.props(['ssn', 'firstname', 'lastname'])), // FP construct, no need to test
  chain(m_findStudent), // impure (can have error with Either.left case), but can be tested by other means (sinon mock)
  chain(m_checkLengthSsn), // checkLengthSsn is pure, testable
  lift(m_cleanInput) // cleanInput is pure, testable
)

const testShowStudent = IO.from(start)
  .map(R.tap(test(showStudentIO, '11')))
  .map(end);

// this run() is for IO monad, no need to double run for perf test
// showStudentIO('11').run(); //?

testShowStudent.run(); //?
testShowStudent.run(); //?