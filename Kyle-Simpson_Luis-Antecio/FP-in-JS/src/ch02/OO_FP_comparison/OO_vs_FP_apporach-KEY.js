// Given a person, find all of their friends that live in the same country
import Student from './Student';

// data setup
var studentA = new Student(123, 'A', 'B', 'IIT', '1990', 'Chicago');
// or, use setters
var studentB = new Student;
studentB.ssn = 456;
studentB.firstname = 'Murat';
studentB.lastname = 'Ozcan';
studentB.birthYear = 1800;
studentB.school = 'IIT'
studentB.city = 'NYC' 
var studentC = new Student(789, 'Kerem', 'Sikerem', 'IIT', '1981', 'Chicago')
const friends = [studentB, studentC];


// OO approach (using methods in the classes)
studentA.studentsInSameCity(friends); //?


// FP approach breaks the problem into smaller parts using pure standalone functions vs  classes & methods
var selector = (city) => student => student.city === city; // this is the filter callback function
var findStudentsBy = (students, selector) => students.filter(selector); // filter gracefully replaces loop & conditional

findStudentsBy(friends, selector('Chicago')); //?

// you could 1-line this
var findStudentsBy_1line = (students, city) => students.filter(student => student.city === city);
findStudentsBy_1line(friends, 'Chicago'); //?