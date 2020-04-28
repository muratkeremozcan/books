import R from 'Ramda';
import { Wrapper as WrapperMonad } from './3.1.new-wrapper-monad';
const db = require('../ch04/student-helper').db;
// const WrapperMonad = require('../../model/monad/Wrapper.js').Wrapper;

// from ch04 2.2.curry-student-example.js
const findStudentById = (db, id) => db.find(id);

// this time we use WrapperMonad instead of wrap (which was instantiated as exported)
// we have to instantiate WrapperMonad with of()
const findStudent = R.curry((db, ssn) =>
  WrapperMonad.of(findStudentById(db, ssn))
);
findStudent(db, 11); //?

// same here; we use WrapperMonad.of to instantiate. Now the student has access to the WrapperMonad's map function.
// (this map  was fmap before, but we don't need regular map anymore anyway, so simply the naming)
// map takes a wrapped context/container/value, applies a function to it, creates & returns a new wrapped context.
// Once student is wrapped, we use map to make a composable student.
const getAddress = student =>
  WrapperMonad.of(student.map(R.prop('_address')))

const sampleStudentData = {
  _ssn: '111-11-1111',
  _firstname: 'Alonzo',
  _lastname: 'Church',
  _birthYear: 1911,
  _address: 'USA'
}
const sampleWrappedStudentData = WrapperMonad.of(sampleStudentData); //?

getAddress(sampleWrappedStudentData); //?

// we use join to flatten the nested layers of wrappers, and get the final value
getAddress(sampleWrappedStudentData).join(); //?
getAddress(sampleWrappedStudentData).join().get(); //?


// composing

// we do not have to rely on .map(R.identity) x2, we just flatten with join() and get() the final value
getAddress(findStudent(db, 11))
  .join()
  .get() //?

// compose the pro way
R.compose(
  getAddress,
  findStudent
)(db, 11)
  .join()
  .get() //?