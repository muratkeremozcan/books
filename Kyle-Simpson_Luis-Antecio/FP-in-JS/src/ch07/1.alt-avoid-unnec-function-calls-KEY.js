import { append, findStudent } from '../ch06/2.showStudent-what-to-test-KEY';
import R from 'ramda';
const Student = require('../../model/Student.js').Student;
const createNewStudent = () => new Student;

/** takes two functions and returns the result of the first one if the value is defined (not false, null, or undefined); 
otherwise, it returns the result of the second function. */
const alt = R.curry((func1, func2, val) => func1 ? func1(val) : func2(val));


// these 2 snippets do the same thing
// if findStudent does not return a null, it's composed with append
// else createNewStudent runs, and gets composed with append
// how can we avoid unnecessary function calls in the 2nd snippet?

// KEY: function combinator alt orchestrates the calls, no function is called prematurely
// because with function combinator, the functions are just references, not executions

const showStudent = R.compose(
  append('#student-info'),
  alt(findStudent, createNewStudent)
);
showStudent('11'); //?


const student = findStudent(11);
if (student != null) {
  append('#student-info', student); //?
} else {
  append('#student-info', createNewStudent('11')); //?
}