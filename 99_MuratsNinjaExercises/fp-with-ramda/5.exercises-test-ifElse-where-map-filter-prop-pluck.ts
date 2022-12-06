import R from 'ramda'

// refactor these to be point-free

const sentence = 'Bobo is a bobo'

const countBobs = (sentence: string) => /bobo/gi.test(sentence)
const countBobsR = R.test(/bobo/gi)

countBobs(sentence) //?
countBobsR(sentence) //?

////////
type Person = {
  name: string
  age: number
  lovesTech: boolean
  worksHard: boolean
}

const person: Person = {
  name: 'Joe',
  age: 30,
  lovesTech: true,
  worksHard: true,
}

const shouldCode = (person: Person) =>
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
  (person: Person) => `${person.name} may enjoy a tech career`,
  (person: Person) => `${person.name} doesn't enjoy a tech career`,
)

shouldCode(person) //?
shouldCodeR(person) //?

/////////

const people = [
  {name: 'Joe', age: 30, lovesTech: true, worksHard: true},
  {name: 'Moe', age: 50, lovesTech: false, worksHard: true},
  {name: 'Boe', age: 20, lovesTech: true, worksHard: false},
]

const getAges = (people: Person[]) => people.map(person => person.age)
const getAgesR = R.map(R.prop('age'))
const getAgesR2 = R.pluck('age')

getAges(people) //?
getAgesR(people) //?
getAgesR2(people) //?

////////

const keepYoungAdults = (people: Person[]) =>
  people.filter(p => p.age >= 18 && p.age <= 25)
const keepYoungAdultsR = R.filter((p: Person) => p.age >= 18 && p.age <= 25)

keepYoungAdults(people) //?
keepYoungAdultsR(people) //?

// R.gt, R.lt etc. compares the first arg to the incoming arg, Rt.gt(18) : is 18 gt then data coming in?

R.gt(10)(20) //?

const notYoungAdultAge = R.either(R.gt(18), R.lt(25))
const isNotYoungAdult = R.propSatisfies(notYoungAdultAge, 'age')
const keepYoungAdultsR2 = R.reject(isNotYoungAdult)

keepYoungAdultsR2(people) //?

// I like this better     18 lte data && 25 gt data
const youngAdultAge = R.both(R.lte(18), R.gt(25))
const isYoungAdult = R.propSatisfies(youngAdultAge, 'age') //?
const keepYoungAdultsR3 = R.filter(isYoungAdult)

// is 18 lte 24 && is 25 gt 24
youngAdultAge(24) //?

keepYoungAdultsR3(people) //?

///////
// If val is null or undefined, return defaultVal.
// Else, return val.
const defaultTo = (defaultVal: number, val: number | null | undefined) =>
  val != null ? val : defaultVal

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
