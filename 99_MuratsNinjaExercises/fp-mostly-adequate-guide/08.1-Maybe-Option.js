import {prop, concat, pipe, match, map, curry} from 'ramda'
import {inspect, add} from '@mostly-adequate/support'
import {Option} from '@swan-io/boxed'

// Container
// the container is for  control flow, error handling, asynchronous actions, state and effects.
// Lots of containers just hold one thing, though they aren't limited to one. We've arbitrarily named its property $value.
// Once data goes into the Container it stays there. We could get it out by using .$value

class Container {
  constructor(x) {
    this.$value = x
  }
  // we use Container.of as a constructor which saves us from having to use "new" keyword
  // we use static method because we do not want class instances calling the "of" method
  static of(x) {
    return new Container(x)
  }
}

Container.of(3) //?
Container.of('hotdogs') //?
Container.of(Container.of({name: 'yoda'})) //?

///////////////
// Functor (aka Mappable):  a type that implements map and obeys some laws
// Once our value, whatever it may be, is in the container, we need a way to run functions on it (via map)
// What do we gain from asking our container to apply functions for us? Well, abstraction of function application.
// When we map a function, we ask the container type to run it for us. This is a very powerful concept, indeed.

// just like array.map; we have Container a instead of [a]
// (a -> b) -> Container a -> Container b
Container.prototype.map = function (f) {
  return Container.of(f(this.$value))
}
// We can work with our value without ever having to leave the Container and keep mapping, which is like composition
// When we map a function, we ask the container type to run it for us
Container.of(2).map(two => two + 2) //?
Container.of('flamethrowers').map(s => s.toUpperCase()) //?
Container.of('bombs').map(concat(' away')).map(prop('length')) //?

////////////// Here we start talking about classic functors
// Maybe

// Maybe : a functor that either contains a value or null
//  a lot like Container with one minor change; it will first check to see if it has a value before calling the supplied function
class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined
  }

  constructor(x) {
    this.$value = x
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value))
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`
  }
}

// Notice our app doesn't explode with errors as we map functions over our null values.
// This is because Maybe will take care to check for a value each and every time it applies a function.
Maybe.of('Malkovich Malkovich').map(match(/a/gi)) //?
Maybe.of(null).map(match(/a/gi)) //?
Maybe.of({name: 'Boris'}).map(prop('age')).map(add(10)) //?
Maybe.of({name: 'Dinah', age: 14}).map(prop('age')).map(add(10)) //?

// Boxed is a nice lib that provides functional utility types and functions for TypeScript and JavaScript
// https://swan-io.github.io/boxed/
// swan-io/boxed: Option is similar to Maybe; Maybe.of == Option.fromNullable
Option.fromNullable('Malkovich Malkovich').map(match(/a/gi)) //?
Option.fromNullable(null).map(match(/a/gi)) //?
Option.fromNullable({name: 'Boris'}).map(prop('age')).map(add(10)) //?
Option.fromNullable({name: 'Dinah', age: 14}).map(prop('age')).map(add(10)) //?

// Maybe / Option use cases
// In the wild, we'll typically see Maybe used in functions which might fail to return a result

// safeHead :: [a] -> Maybe(a)
const safeHead = xs => Maybe.of(xs[0])
const safeHeadS = xs => Option.fromNullable(xs[0])
safeHead([1, 2, 3]) //?
safeHead([]) //?
safeHeadS([1, 2, 3]) //?
safeHeadS([]) //?

// streetName :: Object -> Maybe String
const streetName = pipe(prop('addresses'), safeHead, map(prop('street')))
const streetNameS = pipe(prop('addresses'), safeHeadS, map(prop('street')))
streetName({addresses: []}) //?
streetNameS({addresses: []}) //?
streetName({addresses: [{street: 'Shady Ln.', number: 4201}]}).$value //?
streetNameS({addresses: [{street: 'Shady Ln.', number: 4201}]}).value //?

//////////// KEY:
// if        vs     map
// if/else   vs     maybe

// with map, the imperative analog would be: if (x !== null) { return f(x) }.
// with maybe, the equivalent      would be: if/else

// updateLedger :: Account -> Account
const updateLedger = account => account
// remainingBalance :: Account -> String
const remainingBalance = ({balance}) => `Your balance is $${balance}`
// finishTransaction :: Account -> String
const finishTransaction = pipe(updateLedger, remainingBalance)
{
  // withdraw :: Number -> Account -> Maybe(Account)
  const withdraw = curry((amount, {balance}) =>
    Maybe.of(balance >= amount ? {balance: balance - amount} : null),
  )
  // with map, it is like:  if (x !== null) { return f(x) }.
  // getTwenty :: Account -> Maybe(String)
  const getTwenty = pipe(withdraw(20), map(finishTransaction))

  // Our code, much like Schrödinger's cat, is in two states at once and should maintain that fact until the final function.
  // This gives our code a linear flow despite the logical branching.
  getTwenty({balance: 200.0}) //?
  getTwenty({balance: 10.0}) //?

  // There is, however, an escape hatch. If we would rather return a custom value and continue on, we can use a little helper called maybe.
  // maybe :: b -> (a -> b) -> Maybe a -> b
  const maybe = curry((v, f, m) => {
    if (m.isNothing) {
      return v
    }
    return f(m.$value)
  })

  // with maybe it is like:  if/else
  // getTwenty :: Account -> String
  const getTwentyMaybe = pipe(withdraw(20), maybe("You're broke!", finishTransaction))

  getTwentyMaybe({balance: 200.0}) //?
  getTwentyMaybe({balance: 10.0}) //?
}

// swan-io/boxed: Option
{
  const withdraw = curry((amount, {balance}) =>
    Option.fromNullable(balance >= amount ? {balance: balance - amount} : null),
  )

  // with map, it is like:  if (x !== null) { return f(x) }.
  const getTwenty = pipe(withdraw(20), map(finishTransaction))

  getTwenty({balance: 200.0}).value //?
  getTwenty({balance: 10.0}).value //?

  // swan-io/boxed escape hatch
  const maybe = curry((v, f, m) => {
    if (m.isNone()) {
      return v
    }
    return f(m.value)
  })

  // with maybe it is like:  if/else
  const getTwentyMaybe = pipe(withdraw(20), maybe("You're broke!", finishTransaction))

  getTwentyMaybe({balance: 200.0}) //?
  getTwentyMaybe({balance: 10.0}) //?
}
