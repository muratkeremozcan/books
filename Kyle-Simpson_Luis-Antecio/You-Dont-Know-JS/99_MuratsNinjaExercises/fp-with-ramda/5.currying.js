import * as R from 'ramda'

const add = (x, y) => x + y

const result = add(2, 3)
result //?

// What happens if you don’t give add its required parameters? What if you give too little?
// add(2) // NaN

// So we curry:  return a new function per expected parameter
const addCurried = R.curry(add) // jus wrap the function
const addCurriedClassic = x => y => x + y

addCurried(2) //?
addCurried(2)(3) //? 5
addCurriedClassic(2) //?
addCurriedClassic(2)(3) //?

//
const add3 = (x, y, z) => x + y + z
const greet = (greeting, first, last) => `${greeting}, ${first} ${last}`

const add3CurriedClassic = x => y => z => x + y + z
const greetCurriedClassic = greeting => first => last =>
  `${greeting}, ${first} ${last}`
const add3CurriedR = R.curry(add3) // jus wrap the function
const greetCurriedR = R.curry(greet) // jus wrap the function

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
