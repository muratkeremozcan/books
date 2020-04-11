const db = require('../helper').db;

{  // many side effects in this function
  function showStudent(ssn) {
    let student = db.find(ssn); // (1) access object storage db to look up a student by ssn. db is not a parameter
    if (student !== null) {
      let studentInfo = `<p>${student.ssn},${student.firstname},${student.lastname}</p>`; // (2) reaches outside the function to read values, which can change
      console.log(studentInfo);
      return studentInfo;
    }
    else {
      throw new Error('Student not'); // (3) can cause the entire program stack to end abruptly
    }
  }

  showStudent('444-44-4444'); //?
}


// FP approach
// Separate this long function into shorter functions, each with a single purpose. 
// Reduce the number of side effects by explicitly defining all arguments needed for the functions to carry out their job.

import { curry, compose } from '../fp-tool-belt';
// or use library
const R = require('ramda');

// find function needs a reference to the db and the student id
// we are using curry because we expect the id to be passed in later as an argument
const find = curry((db, id) => { // add an arg to realize curry magic
  let obj = db.find(id);
  if (obj === null) {
    throw new Error('Object not found');
  }
  return obj;
});
// side note: curry magic;
//  if there are more arguments specified in the function than we currently have, return the fn (in curried state)
//  If we got enough args, execute it
find(); //?
find(db); //?
find(db)('444-44-4444'); //?


// instead of assigning to studentInfo, we return what data there is
// we get Person object and display its properties
const csv = student => `${student.ssn}, ${student.firstname}, ${student.lastname}`;
// so far
compose(csv, find(db))('444-44-4444'); //?

// csv is source, find(db)('444-44-4444') is info
// we are going to get source & info arguments in runtime, after having defined this function
const append = curry((source, info) => { 
  source(info); // not sure why necessary
  return info;
});

// being able to reduce the arity with curry enables us to compose like this
const showStudent = compose(
  append(console.log),
  csv,
  find(db)
);

showStudent('444-44-4444'); //? 

