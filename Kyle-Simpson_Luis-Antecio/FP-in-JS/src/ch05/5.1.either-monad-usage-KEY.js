// Either is slightly different than Maybe; one of the values has to occur.
// and, unlike Maybe.Nothing, Either.Left can contain values to which functions can be applied.
// Left : possible error or throwable exception
// Right : successful value (analogous to Just branch of Maybe)

// a common use of Either is to hold the results of a computation that may fail to provide additional information
// KEY difference with Maybe: Either allows results to propagate while holding the possible errors. Maybe does not care for errors.

const Either = require('../../model/monad/Either.js').Either;
const R = require('ramda');
const db = require('../ch04/student-helper').db;
const Student = require('../../model/Student.js').Student;
const Address = require('../../model/Address.js').Address;

const find = (db, id) => db.find(id);
// find(db, 11); 


// 3 steps of Either monad usage:
// (1) wrap/containerize the value with .of(). If you want to secure the value against null or undefined, use fromNullable() instead.
// (2) use Either functions which very similar to Maybe; map, getOrElse etc.
// (3) specify the error case with Either.left
// KEY advantage over Wrapper monad: Either/Maybe monads allows to propagate an invalid value up the composition


const safeFindObject = R.curry(function (db, id) {
  const obj = find(db, id);
  if (obj) {
    // return Either.of(obj); 
    // can also be Either.fromNullable()
    return Either.fromNullable(obj);
  }
  return Either.left(`Object not found with id ${id}`);
});

const findStudent = safeFindObject(db);
findStudent('11'); //?

// with Either, you have the ability to provide a suitable default
findStudent('11').getOrElse() //?
let result = findStudent('11').getOrElse(new Student()) //?

findStudent('xx'); //?
