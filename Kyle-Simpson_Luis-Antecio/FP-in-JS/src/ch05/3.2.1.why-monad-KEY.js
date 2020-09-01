import R from 'Ramda';
import { Wrapper } from '../../model/monad/Wrapper';
const db = require('../ch04/student-helper').db;
// const Wrapper = require('../../model/monad/Wrapper.js').Wrapper;

// from ch04 2.2.curry-student-example.js
const findStudentById = (db, id) => db.find(id);

// 3 steps of Wrap monad usage:
// (1) wrap/containerize the value with .of()
// (2) use map() to apply functions to the value
// (3) flatten and get the result with join() and get()


// this time we use Wrapper.of instead of wrap (which had to be instantiated as exported)
// (1)this is the wrapping/containerizing step for the potentially unsafe value.
const findStudent = R.curry((db, ssn) =>
  Wrapper.of(findStudentById(db, ssn))
);
// findStudent(db, 11); //?

// (1) containerize/wrap with Wrapper.of(). Now the student has access to the monad functions.
// (2) map takes a wrapped/containerized value, applies a function to it, creates & returns a new wrapped context. 
// This allows chaining/composing.
const getAddress = student =>
  Wrapper.of(student.map(R.prop('_address')))


const sampleStudentData = {
  _ssn: '111-11-1111',
  _firstname: 'Alonzo',
  _lastname: 'Church',
  _birthYear: 1911,
  _address: 'USA'
}
const sampleWrappedStudentData = Wrapper.of(sampleStudentData); //?

getAddress(sampleWrappedStudentData); //?

// we use join to flatten the nested layers of wrappers, and get the final value
getAddress(sampleWrappedStudentData).join(); //?
getAddress(sampleWrappedStudentData).join().get(); //?


// composing

// (3) we do not have to rely on .map(R.identity) x2, we just flatten with join() and get() the final value
getAddress(findStudent(db, 11))
  .join()
  .get() //?

// compose; the pro way
R.compose(
  getAddress,
  findStudent
)(db, 11)
  .join()
  .get() //?