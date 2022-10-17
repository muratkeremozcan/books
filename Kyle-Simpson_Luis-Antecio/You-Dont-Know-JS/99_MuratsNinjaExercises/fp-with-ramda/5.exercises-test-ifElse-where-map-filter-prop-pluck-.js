import R from 'ramda'

// refactor these to be point-free

const sentence = 'Bobo is a bobo'

const countBobs = sentence => /bobo/gi.test(sentence)
const countBobsR = R.test(/bobo/gi)

countBobs(sentence) //?
countBobsR(sentence) //?

////////

const person = {
  name: 'Joe',
  age: 30,
  lovesTech: true,
  worksHard: true,
}

const shouldCode = person =>
  person.lovesTech && person.worksHard
    ? `${person.name} may enjoy a tech career!                                                    `
    : `${person.name} wouldn't enjoy a tech career.`

const shouldCodeR = R.ifElse(
  // person => person.lovesTech && person.worksHard,
  // R.prop('lovesTech') && R.prop('worksHard'), // better
  R.where({
    lovesTech: R.equals(true),
    worksHard: R.equals(true),
  }), // best
  person => `${person.name} may enjoy a tech career`,
  person => `${person.name} doesn't enjoy a tech career`,
)

shouldCode(person) //?
shouldCodeR(person) //?

/////////

const people = [
  {name: 'Joe', age: 30, lovesTech: true, worksHard: true},
  {name: 'Moe', age: 50, lovesTech: false, worksHard: true},
  {name: 'Boe', age: 20, lovesTech: true, worksHard: false},
]

const getAges = people => people.map(person => person.age)
const getAgesR = R.map(R.prop('age'))
const getAgesR2 = R.pluck('age')

getAges(people) //?
getAgesR(people) //?
getAgesR2(people) //?

////////

const keepYoungAdults = people => people.filter(p => p.age >= 18 && p.age <= 25)
const keepYoungAdultsR = R.filter(p => p.age >= 18 && p.age <= 25)

keepYoungAdults(people) //?
keepYoungAdultsR(people) //?

// I dislike these solutions, because they don't translate well from the original
// R.gt, R.lt etc. compares the first arg to the incoming arg,
// it makes sense by itself, but the way it is used in a pipeline makes you wish it was reserved
// wish: is 20 bigger than 10?
// reality: is 10 bigger than 20?
R.gt(10)(20) //?

const notYoungAdultAge = R.either(R.gt(18), R.lt(25))
const isNotYoungAdult = R.propSatisfies(notYoungAdultAge, 'age')
const keepYoungAdultsR2 = R.reject(isNotYoungAdult)

keepYoungAdultsR2(people) //?

const youngAdultAge = R.both(R.lte(18), R.gt(25))
const isYoungAdult = R.propSatisfies(youngAdultAge, 'age') //?
const keepYoungAdultsR3 = R.filter(isYoungAdult)

keepYoungAdultsR3(people) //?

///////
// If val is null or undefined, return defaultVal.
// Else, return val.
const defaultTo = (defaultVal, val) => (val != null ? val : defaultVal)

defaultTo(3, 5) //?
defaultTo(3, null) //?
defaultTo(3, undefined) //?

// curry it
const defaultToR = R.curry((defaultVal, val) =>
  val != null ? val : defaultVal,
) //?

defaultToR(3) //?
defaultToR(3)(5) //?
defaultToR(3)(null) //?
