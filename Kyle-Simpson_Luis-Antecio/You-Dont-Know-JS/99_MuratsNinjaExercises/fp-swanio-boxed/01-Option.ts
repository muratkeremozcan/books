import {Option} from '@swan-io/boxed'
// https://swan-io.github.io/boxed/option
// Option is like Maybe, additionally like Some(x) / None or Just(x) / Nothing
// Option represents optional values:
// Replaces undefined and null
// Makes it possible to differentiate nested optionality (Some(None()) vs None())
// Reduces the number of codepaths needed to read and transform such values

// terminology:
// Container : a type that wraps a value
// Functor : Container + has map
// Pointed Functor : Functor + has of
// Monad : Pointed Functor + has flatten
// all Boxed types are Monads

// In your program flow, you don't know what's inside, as if the box was closed.
// When you extract the value from the box, you have a few options

/// example 1
// You can enforce the type using a type parameter
Option.Some<string>('John') //?
Option.None<string>() //?
Option.fromNullable('John') //?

// null and undefined
Option.fromNullable(null) //?
Option.fromNull(null) //?
Option.fromUndefined(undefined) //?

/// example 2
// Let's assume we have `option` be of type `Option<number>`
const option = Option.fromNullable<number>(null) // toggle between null and 5

// returns the value if present or the fallback otherwise
option.getWithDefault(0) //?

// or with match
option.match({
  Some: value => value,
  None: () => 0,
})

//// Data Manipulation
// KEY: map and flatMap functions allow you to transform data in a typesafe way
// use map when returning a normal value,
// user flatMap when we're returning another Box (Container-Functor-Monad)

// map
const some = Option.Some(1)
const none = Option.None()
const nullable = Option.fromNullable<any>(5) // toggle between null and 5
const doubledSome = some.map(x => x * 2)
const doubledNone = none.map(x => x * 2)
const doubledSomething = nullable.map(x => x * 2)

doubledSome //?
doubledNone //?
doubledSomething //?
//
Option.Some<number>(2).map(x => x * 2) //?
Option.None().map(x => x * 2) //?

/// flatMap returns another Box. It used for nested values
Option.Some(3).flatMap(x => (x > 2 ? Option.None() : Option.Some(2))) //?

Option.Some(1).flatMap(x => (x > 2 ? Option.None() : Option.Some(2))) //?

type UserInfo = {
  name: Option<string>
}

type User = {
  id: string
  info: Option<UserInfo>
}

const user: User = {
  id: '1',
  info: Option.Some({
    name: Option.Some('John'),
  }),
}

const userInfo = user.info //?
userInfo.map(info => info.name) //?
user.info.flatMap(info => info.name) //?
user.info.flatMap(info => info.name).getWithDefault('Anonymous user') //?
user.info.flatMap(info => info.name).flatMap(name => Option.Some(name)) //?

// these won't work with get()
// user.info.get() //?
// user.info.flatMap(info => info.name).get() //?
// this works with get()
if (user.info.isSome()) {
  const info = user.info.get() //?
  if (info.name.isSome()) {
    info.name.get() //?
  }
}
