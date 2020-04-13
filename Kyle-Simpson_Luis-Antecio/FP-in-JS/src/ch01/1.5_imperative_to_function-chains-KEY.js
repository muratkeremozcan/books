import _ from 'lodash';
// const _ = require('lodash'); // or this

// imperative code to function chain example
// A function chain is a lazy evaluated program, which means it defers its execution until needed. 
// This benefits performance because you can avoid executing entire sequences of code that won’t be used anywhere else

// compute avg grade of students enrolled in more than one class

let students = [
	{ enrolled: 2, grade: 100 },
	{ enrolled: 2, grade: 80 },
	{ enrolled: 1, grade: 89 }
];


// imperative approach
var totalGrades = 0;
var totalStudentsFound = 0;

for (let i = 0; i < students.length; i++) {
	let student = students[i];
	if (student.enrolled > 1) {
		totalGrades += student.grade;
		totalStudentsFound++;
	}
}
// var average = totalGrades / totalStudentsFound; //?


// declarative approach with function chain / call-by-need principle
// we can eliminate the need to declare variables, change them, we can avoid loops and conditionals
// 3 things are needed: identify the right students, extract their grades, take their average

const result =
	_.chain(students)
		.filter(student => student.enrolled > 1) // use filter for conditional logic
		.map(_.property('grade')) //  use map to 'mutate' data (doesn't mutate) . _.property is used to access a path in an object
		.mean()
		.value(); // take their average

result; //?

const resulto =
	_.chain(students)
		.filter(student => student.enrolled)
		.map(_.property('grade'))
		.value();

resulto; //?