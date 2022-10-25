import {prop, curry} from 'ramda'
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

// swan-io Either
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
    ? Either.of(birthDate.diff(now, 'days'))
    : left('Birth date could not be parsed')
})
// with swan-io Either
const getAgeS = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')
  return birthDate.isValid()
    ? Result.Ok(birthDate.diff(now, 'days'))
    : Result.Error('Birth date could not be parsed')
})
const getAgeSO = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')
  return birthDate.isValid()
    ? Option.Some(birthDate.diff(now, 'days'))
    : Option.fromNullable('Birth date could not be parsed')
})

getAge(moment(), {birthDate: '2005-12-12'}) //?
getAge(moment(), {birthDate: 'July 4, 2001'}) //?
getAgeS(moment(), {birthDate: '2005-12-12'}) //?
getAgeS(moment(), {birthDate: 'July 4, 2001'}) //?
getAgeSO(moment(), {birthDate: '2005-12-12'}) //?
getAgeSO(moment(), {birthDate: 'July 4, 2001'}) //?

/////
