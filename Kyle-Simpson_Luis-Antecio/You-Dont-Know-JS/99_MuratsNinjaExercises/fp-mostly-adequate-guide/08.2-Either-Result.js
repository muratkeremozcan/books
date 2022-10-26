import {prop, curry, compose, concat, add, map, identity, toString} from 'ramda'
import {inspect} from '@mostly-adequate/support'
import {Result, Option} from '@swan-io/boxed'
import moment from 'moment'

// Either : Either is a functor that represents a value of two possible types (a disjunction)
// useful for error handling
// Right is like Container
// Left ignores the request to map over it

class Either {
  static of(x) {
    return new Right(x)
  }

  constructor(x) {
    this.$value = x
  }
}

class Left extends Either {
  map(f) {
    return this
  }

  inspect() {
    return `Left(${inspect(this.$value)})`
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this.$value))
  }

  inspect() {
    return `Right(${inspect(this.$value)})`
  }
}

const left = x => new Left(x)

Either.of('rain').map(str => `b${str}`) //?
left('rain').map(str => `It's gonna ${str}, better bring your umbrella!`) //?
Either.of({host: 'localhost', port: 80}).map(prop('host')) //?
left('rolls eyes...').map(prop('host')) //?

// swan-io Result is like Either, Left, Right bundled into one
Result.Ok('rain').map(str => `b${str}`) //?
Result.Error('rain').map(str => `b${str}`) //?
Result.Ok({host: 'localhost', port: 80}).map(prop('host')) //?
Result.Error('rolls eyes...').map(prop('host')) //?

//////// example :  a function that might not succeed

// note from type sig: we return Either(String, Number),
// which holds a String as its left value and a Number as its Right
// getAge :: Date -> User -> Either(String, Number)
const getAge = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')

  return birthDate.isValid()
    ? Either.of(Math.abs(birthDate.diff(now, 'years')))
    : left('Birth date could not be parsed')
})
// with swan-io Result
const getAgeR = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')
  return birthDate.isValid()
    ? Result.Ok(Math.abs(birthDate.diff(now, 'years')))
    : Result.Error('Birth date could not be parsed')
})
// Compare Result to Option
// KEY: the distinction in Result is that we have a clue as to why our program has derailed,
// with Option.fromNullable, it may have gone either way, not necessarily an error
const getAgeO = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')
  return birthDate.isValid()
    ? Option.Some(Math.abs(birthDate.diff(now, 'years')))
    : Option.fromNullable('Birth date could not be parsed')
})

getAge(moment(), {birthDate: '2022-12-12'}) //?
getAge(moment(), {birthDate: 'July 4, 2001'}) //?
getAgeR(moment(), {birthDate: '2005-12-12'}) //?
getAgeR(moment(), {birthDate: 'July 4, 2001'}) //?
getAgeO(moment(), {birthDate: '2005-12-12'}) //?
getAgeO(moment(), {birthDate: 'July 4, 2001'}) //?

///// example 2
// branching our control flow depending on the validity of the birth date,
// yet it reads as one linear motion from right to left rather than climbing through the curly braces of a conditional statement

// fortune :: Number -> String
const fortune = compose(
  concat('If you survive, you will be '),
  toString,
  add(1),
)

// KEY: notice that the function fortune is is completely ignorant of any functors milling about (similar to finishTransaction)
// Lifting: At the time of calling, a function can be surrounded by map,
// which transforms it from a non-functory function to a functory one

// zoltar :: User -> Either(String, _)
const zoltar = compose(map(console.log), map(fortune), getAgeR(moment()))

moment() //?

zoltar({birthDate: '2005-12-12'}) //?
// 'If you survive, you will be 17'
// Right(undefined)

// Usually, we'd move the console.log out of our zoltar function and map it at the time of calling
const zoltar2 = compose(map(fortune), getAgeR(moment()))
map(console.log, zoltar2({birthDate: '2005-12-12'})) //?

zoltar({birthDate: 'balloons!'}) //?
// Left('Birth date could not be parsed')
