import * as R from 'ramda'
const bobo = {
  firstName: 'Bobo',
  lastName: 'Flakes',
}

// Composition: classic vs ramda
// Benefits of Ramda are currying, point-free style, and the data-last pattern

// const toUpperCase = str => str.toUpperCase()
const toUpperCase = R.toUpper

// const reverse = str => str.split('').reverse().join('')
const reverse = R.reverse

// const firstName = obj => obj.firstName
const firstName = R.prop('firstName')

// composition
// reverse(toUpperCase(firstName(bobo))) //?

const upperAndReverseFirstName = user => reverse(toUpperCase(firstName(user)))
const upperAndReverseFirstNameR = R.pipe(firstName, toUpperCase, reverse) //?
// const  upperAndReverseFirstNameR = R.compose(reverse, toUpperCase, firstName) //?

upperAndReverseFirstName(bobo) //?
upperAndReverseFirstNameR(bobo) //?

/////////
const users = [
  {
    firstName: 'Bobo',
    lastName: 'Flakes',
  },
  {
    firstName: 'Lawrence',
    lastName: 'Shilling',
  },
  {
    firstName: 'Anon',
    lastName: 'User',
  },
]

// const mapUsers = users =>
// const mapUsers = users => users.map(user => reverse(toUpperCase(firstName(user))))
const mapUsers = users => users.map(upperAndReverseFirstName)
const mapUsersR = R.map(upperAndReverseFirstNameR)

mapUsers(users) //?
mapUsersR(users) //?

////

const doMath = R.pipe(
  x => x * 2, // double
  x => x * 3, // triple
  R.tap(console.log), // you can inspect with tap
  x => x * x, // square
  x => x + 1, // increment
)
doMath(1) //?

const double = x => x * 2 // double
const triple = x => x * 3 // triple
const square = x => x * x // square
const increment = x => x + 1 // increment

// composition is right to left, as in the mathematical composition
increment(square(triple(double(1)))) //?

const doMathReversed = R.compose(
  increment,
  square,
  triple,
  R.tap(n => {
    // you can inspect with tap more elaborately
    console.log('after doubling ', n)
    return n
  }),
  double,
)
doMathReversed(1) //?

const doMathReversed2 = R.compose(
  increment,
  square,
  triple,
  n => {
    // you don't need tap if inspecting elaborately
    console.log('after doubling ', n)
    return n
  },
  double,
)
doMathReversed2(1) //?
