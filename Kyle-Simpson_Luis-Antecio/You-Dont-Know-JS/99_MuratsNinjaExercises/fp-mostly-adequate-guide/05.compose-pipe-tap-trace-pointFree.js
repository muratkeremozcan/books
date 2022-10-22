import {
  compose,
  pipe,
  tap,
  reduce,
  toLower,
  replace,
  join,
  map,
  split,
  curry,
  prop,
  add,
} from 'ramda'

// f and g are functions, x is piped through them. g runs first.
const compose1 = (f, g) => x => f(g(x))

// super saiyan form
const compose2 =
  (...fns) =>
  (...args) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]

const toUpperCase = x => x.toUpperCase()
const exclaim = x => `${x}!`

const shoutC = str => exclaim(toUpperCase(str))
const shout1 = compose1(exclaim, toUpperCase)
const shout2 = compose2(exclaim, toUpperCase)
const shoutR = compose(
  data => {
    console.log(data)
    return data
  },
  exclaim,
  tap(data => {
    console.log(data)
  }),
  toUpperCase,
  tap(console.log),
)

shoutC('send in the clowns') //?
shout1('send in the clowns') //?
shout2('send in the clowns') //?
shoutR('send in the clowns') //?

/////
const head = x => x[0]
// const reverseC = arr => arr.reverse()
const reverseC = arr => arr.reduce((acc, curr) => [curr, ...acc], [])
const reverse = reduce((acc, curr) => [curr, ...acc], [])
const last = compose(head, reverse)

reverseC(['jumpkick', 'roundhouse', 'uppercut']) //?
reverse(['jumpkick', 'roundhouse', 'uppercut']) //?
last(['jumpkick', 'roundhouse', 'uppercut']) //?

//////
// Composition is associative, meaning it doesn't matter how you group two of them.
// associativity
// compose(f, compose(g, h)) === compose(compose(f, g), h);
// compose(toUpperCase, compose(head, reverse))(['jumpkick', 'roundhouse', 'uppercut']) //?
// compose(compose(toUpperCase, head), reverse)(['jumpkick', 'roundhouse', 'uppercut']) //?

// previously we'd have to write two composes, but since it's associative,
// we can give compose as many fn's as we like and let it decide how to group them.
const arg = ['jumpkick', 'roundhouse', 'uppercut']
const lastUpper = compose(toUpperCase, head, reverse)
const loudLastUpper = compose(exclaim, toUpperCase, head, reverse)
// If familiar with Fowler's "Refactoring", one might recognize this process as "extract function"...except without all the object state to worry about.
const betterUpper = compose(exclaim, lastUpper)

lastUpper(arg) //?
loudLastUpper(arg) //?
betterUpper(arg) //?

// pipe version
const lastUpperP = pipe(reverse, head, toUpperCase)
const betterUpperP = pipe(lastUpperP, exclaim)

betterUpperP(arg) //?

/////// Pointfree

// not pointfree because we mention the data: word
const snakeCase = word => word.toLowerCase().replace(/\s+/gi, '_')

const snakeCaseRC = compose(replace(/\s+/gi, '_'), toLower)
// pointfree
const snakeCaseR = pipe(toLower, replace(/\s+/gi, '_'))

snakeCase('Hello World') //?
snakeCaseR('Hello World') //?
snakeCaseRC('Hello World') //?

// not pointfree because we mention the data: name
const initials = name =>
  name.split(' ').map(compose(toUpperCase, head)).join('. ')
const initialsR = compose(
  // tap(d => {
  //   console.log(d)
  // }),
  join('. '),
  map(compose(toUpperCase, head)),
  split(' '),
)

initials('hunter stockton thompson') //?
initialsR('hunter stockton thompson') //?

///// debugging with tap and trace
const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

const dasherize = compose(
  join('-'),
  map(toLower), // need to map over the array to get the individual words, remove map to see the error
  trace('after split'),
  tap(x => {
    console.log('after split')
    console.log(x)
  }),
  split(' '),
)

dasherize('The world is a vampire') //?

/////////// Exercises

const cars = [
  {
    name: 'Aston Martin One-77',
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true,
  },
  {
    name: 'Ferrari FF',
    horsepower: 660,
    dollar_value: 700000,
    in_stock: false,
  },
]

// use compose to rewrite the function below
const isLastInStock = cars => {
  const lastCar = last(cars)
  return prop('in_stock', lastCar)
}
const isLastInStockR1 = pipe(last, prop('in_stock'))
const isLastInStockR2 = compose(prop('in_stock'), last)

isLastInStock(cars) //?
isLastInStockR1(cars) //?
isLastInStockR2(cars) //?

///
// Use the helper function average to refactor averageDollarValue as a composition.
const average = xs => reduce(add, 0, xs)
const averageDollarValue = cars => {
  const dollarValues = map(c => c.dollar_value, cars)
  return average(dollarValues)
}
const averageDollarValueR = pipe(map(prop('dollar_value')), average)
const averageDollarValueR2 = compose(average, map(prop('dollar_value')))

averageDollarValue(cars) //?
averageDollarValueR(cars) //?
averageDollarValueR2(cars) //?
