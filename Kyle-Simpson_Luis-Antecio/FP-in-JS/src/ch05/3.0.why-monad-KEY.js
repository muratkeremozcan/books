// Functors map functions of one type to another. More-specialized behavior can be found in functional data types called monads.
// Among other things, monads can streamline error handling in your code, allowing you to write fluent function compositions.
// What’s their relationship to functors? Monads are the containers that functors “reach into.”


import R from 'Ramda';
const db = require('../ch04/student-helper').db;
const wrap = require('../../model/Wrapper.js').wrap;

// from ch04 2.2.curry-student-example.js
const findStudentById = (db, id) => db.find(id);
findStudentById(db, 11); //?


// we use wrap to safeguard against potentially unsafe values
const findStudent = R.curry((db, ssn) =>
  wrap(findStudentById(db, ssn))
);
findStudent(db, 11); //?


// fmap takes a wrapped context/container/value, applies a function to it, creates & returns a new wrapped context
// once wrapped, we use fmap (vs map) to make a chainable student 
const getAddress = student =>
  wrap(student.fmap(R.prop('_address')))

const sampleStudentData = {
  _ssn: '111-11-1111',
  _firstname: 'Alonzo',
  _lastname: 'Church',
  _birthYear: 1911,
  _address: 'USA'
}
const sampleWrappedStudentData = wrap(sampleStudentData); //?

getAddress(sampleWrappedStudentData); //?
// remember how we yield the value
getAddress(sampleWrappedStudentData).map(R.identity).map(R.identity); //?
// with R.identity or console.log, or a mix of both
getAddress(sampleWrappedStudentData).map(R.tap(console.log)).map(R.tap(console.log)); //?
getAddress(sampleWrappedStudentData).map(R.identity).map(R.tap(console.log)); //?

// slowly getting to the point...

// realize the shortcoming: in order to extract the doubly wrapped value, you have to have to apply R.identity 2x.
// monads try to address this problem by using 'flatten' (coming up) 

// how would we compose it?
getAddress(findStudent(db, 11))
  .map(R.identity)
  .map(R.identity); //?

// or pro way
R.compose(
  getAddress,
  findStudent
)(db, 11)
  .map(R.identity)
  .map(R.identity)
; //?

