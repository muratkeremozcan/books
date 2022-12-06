import * as R from 'ramda'

const add = (x: number, y: number) => x + y

const result = add(2, 3)
result //?

// What happens if you don’t give add its required parameters? What if you give too little?
// add(2) // NaN

// So we curry:  return a new function per expected parameter
const addCurried = R.curry(add) // jus wrap the function
const addCurriedClassic = (x: number) => (y: any) => x + y

addCurried(2) //?
addCurried(2)(3) //? 5
addCurriedClassic(2) //?
addCurriedClassic(2)(3) //?

//
const add3 = (x: any, y: any, z: any) => x + y + z
const greet = (greeting: any, first: any, last: any) =>
  `${greeting}, ${first} ${last}`

const add3CurriedClassic = (x: number) => (y: any) => (z: any) => x + y + z
const greetCurriedClassic = (greeting: string) => (first: any) => (last: any) =>
  `${greeting}, ${first} ${last}`
const add3CurriedR = R.curry(add3) // just wrap the function
const greetCurriedR = R.curry(greet) // just wrap the function

add3CurriedClassic(2)(3) //?
add3CurriedClassic(2)(3)(4) //?
// add3CurriedClassic(2, 3, 4) // doesn't work

greetCurriedClassic('hello') //?
greetCurriedClassic('hello')('John')('Doe') //?
// greetCurriedClassic('hello', 'John', 'Doe') // doesn't work

add3CurriedR(2)(3) //?
add3CurriedR(2)(3)(4) //?
// the advantage of ramda is flexible arity
add3CurriedR(2, 3, 4) //?

greetCurriedR('hello', 'John') //?
greetCurriedR('hello')('John')('Doe') //?
// flexible arity with ramda!
greetCurriedR('hello', 'John', 'Doe') //?
