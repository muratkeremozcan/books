// https://www.educative.io/courses/functional-programming-patterns-with-ramdajs/xV9vlmDPJAE
import * as R from 'ramda'
import employees from './employees.json'

// Boolean
// Number
// String
// Array
// Object
// Function

// Store them as variables
// Insert them into arrays
// Assign them as object properties (methods)
// Pass them as arguments
// Return them from other functions

const isEven = num => num % 2 === 0

;[1, 2, 3, 4, 5].filter(isEven) //?
R.filter(isEven, [1, 2, 3, 4, 5]) //?
R.filter(isEven)([1, 2, 3, 4, 5]) //?

///
const addNumbers = x => y => x + y

addNumbers(1) //?
addNumbers(1)(2) //?

/////
const nums = [1, 2, 3, 4, 5, 6, 7, 8]

// doubled
nums.map(n => n * 2) //?
R.map(n => n * 2, nums) //?
R.map(n => n * 2)(nums) //?

// evens only
nums.filter(n => n % 2 === 0) //?
R.filter(n => n % 2 === 0, nums) //?
R.filter(n => n % 2 === 0)(nums) //?

// sum
nums.reduce((acc, total) => acc + total, 0) //?
R.reduce((acc, total) => acc + total, 0, nums) //?
R.reduce((acc, total) => acc + total, 0)(nums) //?

///////////////
// array methods vs ramda

// const getSalaries = employees => employees.map(employee => employee.salary)
// const getSalaries = R.map(R.prop('salary'))
const getSalaries = R.pluck('salary')

// const isBelowSixFigures = salary => salary < 100000
const isBelowSixFigures = R.lt(R.__, 100000) //?

// const calculateMonthlyPaycheck = salary => salary / 24
const calculateMonthlyPaycheck = R.divide(R.__, 12) //?

const toUSD = amount =>
  amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
// const toUSD = R.curry(amount =>
//   amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
// ) //?

const getMedianSixFigurePaycheck = R.pipe(
  getSalaries,
  R.reject(isBelowSixFigures),
  R.median,
  calculateMonthlyPaycheck,
  // R.tap(console.log), // move it around to see the data flow
  toUSD,
)

getMedianSixFigurePaycheck(employees) //?
