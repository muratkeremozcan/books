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

///// map filter reduce vs R.map R.filter R.reduce
const isEven = (num: number) => num % 2 === 0

;[1, 2, 3, 4, 5].filter(isEven) //?
R.filter(isEven, [1, 2, 3, 4, 5]) //?
R.filter(isEven)([1, 2, 3, 4, 5]) //?
R.reject(isEven)([1, 2, 3, 4, 5]) //?

/// currying
const addNumbers = (x: number) => (y: any) => x + y

addNumbers(1) //?
addNumbers(1)(2) //?

const nums = [1, 2, 3, 4, 5, 6, 7, 8]

// doubled
nums.map(n => n * 2) //?
R.map(n => n * 2, nums) //?
R.map((n: number) => n * 2)(nums) //?

// evens only
nums.filter(n => n % 2 === 0) //?
R.filter(n => n % 2 === 0, nums) //?
R.filter((n: number) => n % 2 === 0)(nums) //?

// sum
nums.reduce((acc, total) => acc + total, 0) //?
R.reduce((acc, total) => acc + total, 0, nums) //?
R.reduce((acc: number, total: number) => acc + total, 0)(nums) //?

///// R.pluck, R.pipe, R.tap

// const getSalaries = employees => employees.map(employee => employee.salary)
// const getSalaries = R.map(R.prop('salary'))
const getSalaries = R.pluck('salary')

// const isBelowSixFigures = salary => salary < 100000
const isBelowSixFigures = R.lt(R.__, 100000) //?

// const calculateMonthlyPaycheck = salary => salary / 24
const calculateMonthlyPaycheck = R.divide(R.__, 12) //?

const toUSD = (amount: {
  toLocaleString: (arg0: string, arg1: {style: string; currency: string}) => any
}) => amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
// const toUSD = R.curry(amount => // optional to curry here
//   amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
// ) //?

const getMedianSixFigurePaycheck = R.pipe(
  // @ts-ignore, or use fp-ts
  getSalaries,
  R.reject(isBelowSixFigures),
  R.median,
  calculateMonthlyPaycheck,
  // R.tap(console.log), // move it around to see the data flow
  toUSD,
)

getMedianSixFigurePaycheck(employees) //?
