import {prop, append, compose, pipe, match, map, curry} from 'ramda'
import {inspect, add} from '@mostly-adequate/support'
import {Option} from '@swan-io/boxed'

// Either : Either is a functor that represents a value of two possible types (a disjunction)
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
