import {
  compose,
  partial,
  partialObject,
  partialRight,
  ifElse,
  pipe,
  curry,
} from 'ramda'

const multiply = (a: number, b: number) => a * b
const double = partial(multiply, [2])

// the function waits waits for execution, upon the second arg being passed
double
double(3) //?

////

const greet = (
  salutation: string,
  title: string,
  firstName: string,
  lastName: string,
) => salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!'

const sayHello = partial(greet, ['Hello'])
// the function waits for 3 arguments to be passed before executing
sayHello
sayHello('Ms', 'Jane', 'Jones') //?

const sayHelloMs = partial(greet, ['Hello', 'Ms'])
sayHelloMs('Jane', 'Jones') //?

///// partialObject

const multiplyO = ({a, b}: {a: number; b: number}) => a * b
const doubleO = partialObject(multiplyO, {a: 2})
// the function waits for the second arg to be passed before executing
doubleO
doubleO({b: 3}) //?

///// partialRight
// instead of waiting for the latter args to be passed, waits for earlier args
const triple = partialRight(multiply, [3])
triple(2) //?

const greetMsJaneJones = partialRight(greet, ['Ms', 'Jane', 'Jones'])
greetMsJaneJones //?
greetMsJaneJones('Hello') //?

const greetJaneJones = partialRight(greet, ['Jane', 'Jones'])
greetJaneJones('Hello', 'Ms') //?

//// curry

const add = (x: number, y: number) => x + y

const result = add(2, 3)
result //?

// What happens if you don’t give add its required parameters?
// What if you give too little?
// add(2) // NaN

// So we curry: return a new function per expected parameter
const addCurried = curry(add) // just wrap the function in curry
const addCurriedClassic = (x: number) => (y: number) => x + y

addCurried(2) // waits to be executed
addCurried(2)(3) //? 5
addCurriedClassic(2) // waits to be executed
addCurriedClassic(2)(3) //?

const add3 = (x: number, y: number, z: number) => x + y + z
const greetFirstLast = (greeting: string, first: string, last: string) =>
  `${greeting}, ${first} ${last}`

const add3CurriedClassic = (x: number) => (y: number) => (z: number) =>
  x + y + z
const greetCurriedClassic =
  (greeting: string) => (first: string) => (last: string) =>
    `${greeting}, ${first} ${last}`
const add3CurriedR = curry(add3) // just wrap the function
const greetCurriedR = curry(greetFirstLast) // just wrap the function

add3CurriedClassic(2)(3) // waiting to be executed
add3CurriedClassic(2)(3)(4) //?
// add3CurriedClassic(2, 3, 4) // doesn't work

greetCurriedClassic('hello') // waiting to be executed
greetCurriedClassic('hello')('John')('Doe') //?
// greetCurriedClassic('hello', 'John', 'Doe') // doesn't work

add3CurriedR(2)(3) // waiting to be executed
add3CurriedR(2)(3)(4) //? 9
// the advantage of ramda is flexible arity
add3CurriedR(2, 3, 4) //?

greetCurriedR('hello', 'John') // waiting to be executed
greetCurriedR('hello')('John')('Doe') //? hello, John Doe
// flexible arity with ramda!
greetCurriedR('hello', 'John', 'Doe') //? hello, John Doe

//// ifElse

const hasAccess = false // toggle this to see the difference

function logAccessClassic(hasAccess: boolean) {
  if (hasAccess) {
    return 'Access granted'
  } else {
    return 'Access denied'
  }
}
logAccessClassic(hasAccess) //?

const logAccessTernary = (hasAccess: boolean) =>
  hasAccess ? 'Access granted' : 'Access denied'
logAccessTernary(hasAccess) //?

// The advantage is that you can package the logic away into a function
// we can get very creative with function expressions
// vs conditions inside an if statement, or a ternary value
const logAccessRamda = ifElse(
  (hasAccess: boolean) => hasAccess,
  () => 'Access granted',
  () => 'Access denied',
)

logAccessRamda(hasAccess) //?

///// pipe

// create a function that composes the three functions
const toUpperCase = (str: string) => str.toUpperCase()
const emphasizeFlavor = (flavor: string) => `${flavor} IS A GREAT FLAVOR`
const appendIWantIt = (str: string) => `${str}. I want it`

// with Ramda, we can pass the argument later
const composeClassic = (flavor: string) =>
  appendIWantIt(emphasizeFlavor(toUpperCase(flavor)))
const composeRamda = compose(appendIWantIt, emphasizeFlavor, toUpperCase) //)
const pipeRamda = pipe(toUpperCase, emphasizeFlavor, appendIWantIt)

composeClassic('chocolate') //?
composeRamda('chocolate') //?
pipeRamda('chocolate') //?
