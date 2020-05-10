// there is no indexedDB for node, so the promise find is obsolete. 
// Using the regular one is not thenable...
// kind of stuck, just looking at the pretty code

const _ = require('lodash');
const R = require('ramda');
import { openDB } from 'idb';
const Either = require('../../model/monad/Either.js').Either;
const Maybe = require('../../model/monad/Maybe.js').Maybe;
const IO = require('../../model/monad/IO.js').IO;
const studentDb = require('../ch04/student-helper').db;
const { createLogger, format, transports } = require('winston');
const logger = createLogger({
  level: 'verbose',
  transports: [
    new transports.Console({})
  ]
});
// const db = await openDB(studentDb, 1)

const db = require('../ch04/student-helper').db;

const validLength = (len, str) => str.length === len;
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

// const find = R.curry((db, id) => db.find(id));
// find :: DB, String -> Promise(Student)
const find = function (db, ssn) {
  let trans = db.transaction(['students'], 'readonly');
  const store = trans.objectStore('students');
  return new Promise(function(resolve, reject) {
      let request = store.get(ssn);
      request.onerror = function() {
          if(reject) {
             reject(new Error('Student not found!'));
          }
      };
      request.onsuccess = function() {
          resolve(request.result);
      };
  });
};

// the key idea her is to make curried versions of what you were chaining 

// fetchStudentDBAsync :: DB -> String -> Promise(Student)
/** curies the data store object so you can include this function in to composition */
const fetchStudentDBAsync = R.curry(function (db, ssn) {
  return find(db, ssn);
});
// findStudentAsync :: String -> Promise
const findStudentAsync = fetchStudentDBAsync(db);

// KEY!

/** enables chaining operations on thenable types (objects that implement a then method like Promises)  
 * 
 * then :: f -> Thenable -> Thenable
*/
const then = R.curry(function (f, thenable) {
 return thenable.then(f);
});

/** Provides error logic for a promise object 
* 
* catchP :: f -> Promise -> Promise
*/
const catchP = R.curry(function (f, promise) {
 return promise.catch(f);
});

// errorLog :: Error -> void
const errorLog = logger.info('error happened');

// the key difference here is we are using promises in function composition
// compose can still be used to orchestrate point-free programs that glue together functions
// that won’t execute at the same time, but rather in the future

const showStudentAsync = R.compose(
  catchP(errorLog),
  then(append('#student-info')),  
  then(csv),
  then(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudentAsync),
  map(checkLengthSsn),
  lift(cleanInput)); 

  // showStudentAsync('11')