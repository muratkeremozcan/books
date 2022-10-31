import {Result, Option} from '@swan-io/boxed'
// https://swan-io.github.io/boxed/result

// Result is like Either

// Exceptions can be tricky to handle
// there's nothing in the type system that tracks if an error has been handled,
// which is error prone, and adds to your mental overhead.
// Result helps as it makes the value hold the success state, making it dead-simple to track with a type-system.

// the Result type is a box that can have two states:
// Ok(value)
// Error(error)

/// example 1
Result.Ok<string>('John') //?
Result.Error('something happened') //?

// Option can be converted to Result
// Result can also yield an Option

/// Option.toResult(errorWhenNone)
// converts Option to Result type. Result.Ok if option is Some, Result.Error otherwise
Option.Some(2).toResult('not found') //?
Option.None().toResult('not found') //?
// (option, value when none)
Result.fromOption(Option.Some(2), 'not found') //?
Result.fromOption(Option.None(), 'not found') //?

/// example 2

// Let's say you have some function that throws an error
const init = (id: string) => {
  if (id.length !== 4) {
    throw new Error()
  }
  return id
}

const myId = '1234' // toggle between 3 and 4 chars
// Here, result will either be:
// - Ok(value)
// - Error(error)
Result.fromExecution(() => init(myId)) //?

// It works with promises too:
const promise = (val: number) =>
  new Promise((resolve, reject) => {
    return (
      setTimeout(() => resolve(`Resolved: ${val}`), val * 10),
      setTimeout(() => reject(`Rejected: ${val}`), val * 11) // change to 9 to see the difference
    )
  })

// `value` will either be:
// - Ok(res)
// - Error(error)
Result.fromPromise(promise(2)) //?

//// Data Manipulation
// KEY: map and flatMap functions allow you to transform data in a typesafe way
// use map when returning a normal value,
// user flatMap when we're returning another Box (Container-Functor-Monad)

/// map
// If the result is Ok(value) returns Ok(f(value)), otherwise returns Error(error)

Result.Ok(2).map(x => x * 2) //?
Result.Ok(2).map(x => Result.Ok(x * 2)) //?

/// mapError
// If the result is Error(error) returns Error(f(error)), otherwise returns Ok(value).
Result.Error(2).mapError(x => x * 2) //?
Result.Error(2).mapError(x => Result.Ok(x * 2)) //?
Result.Error(2).mapError(x => Result.Error('something went wrong')) //?
Result.Ok(2).mapError(x => Result.Error('something went wrong')) //?

/// flatMap is used for nested values
Result.Ok(1).flatMap(x => (x > 2 ? Result.Error('some error') : Result.Ok(2))) //?
Result.Ok(3).flatMap(x => (x > 2 ? Result.Error('some error') : Result.Ok(2))) //?
Result.Error('initial error').flatMap(x =>
  x > 2 ? Result.Error('some error') : Result.Ok(2),
) //?
Result.Ok(2).flatMap(x => (x > 2 ? Result.Error('some error') : Result.Ok(2))) //?

/// flatMapError
Result.Error(1).flatMapError(x =>
  x > 2 ? Result.Error('some error') : Result.Ok(2),
) //?
Result.Error(3).flatMapError(x =>
  x > 2 ? Result.Error('some error') : Result.Ok(2),
) //?
Result.Ok('ok').flatMapError(x =>
  x > 2 ? Result.Error('some error') : Result.Ok(2),
) //?

/// getWithDefault()
// If the result is Ok(value) returns value, otherwise returns defaultValue.

Result.Ok(2).getWithDefault(1) //?
Result.Error('error').getWithDefault(1 as never) //?

/// get()
// Returns the value contained in Ok(value). Only usable within a isOk() check.

/// getError()
// Returns the error contained in Error(error). Only usable within a isError() check.

// isOk(), isError()
// Type guards. Checks if the result is Ok(value) or Error(error).
const result = Result.Ok(2)
const resultErr = Result.Error('error')

// these won't work
// result.get()
// resultErr.getError()

if (result.isOk()) {
  result.get() //?
}
if (resultErr.isError()) {
  resultErr.getError() //?
}

/// toOption()
// converts Result type to Option (note that option does not have a fromResult(), but it has a  toResult() function)
Result.Ok(2).toOption() //?
Result.Error('error').toOption() //?

/// fromOption()
// converts Option to Result by yielding
// (option, value when none)
Result.fromOption(Option.Some(2), 'not found') //?
Result.fromOption(Option.None(), 'not found') //?

/// match()
// match the Result state

// toggle between the two
const resultO = Result.Ok<number | string>(2)
// const resultO = Result.Error('some err')

const valueToDisplay = resultO.match({
  Ok: v => v,
  Error: e => `${e}: error`,
})
valueToDisplay //?

/// tap()
// for logging and debugging
// executes with Result, will work whether it's Ok or Error

resultO.tap(console.log) //?
resultO.tap(s => {
  console.log(s)
})

/// tapOk()
// executes with Result.Ok, no op with result.Error

resultO.tapOk(console.log) //?
resultO.tapOk(s => {
  console.log(s)
}) //?

/// tapError()
// executes with Result.Error, no op with result.Ok

resultO.tapError(console.log) //?
resultO.tapError(s => {
  console.log(s)
})

/// all()
// array of results to one result

Result.all([Result.Ok(1), Result.Ok(2), Result.Ok(3)]) //?
Result.all([Result.Ok(1), Result.Error('error'), Result.Ok(3)]) //?

/// allFromDict(options)
// dict of results to one result
Result.allFromDict({a: Result.Ok(1), b: Result.Ok(2), c: Result.Ok(3)}) //?
Result.allFromDict({
  a: Result.Ok(1),
  b: Result.Error('error'),
  c: Result.Ok(3),
}) //?

/// fromExecution()
// Takes a function returning Value that can throw an Error and returns a Result<Value, Error>

Result.fromExecution(() => 1) //?
Result.fromExecution(() => {
  // throw 'some error'
  throw new Error('some error')
}) //?

// fromPromise()
// Takes a Promise<Value> that can fail with Error and returns a Promise<Result<Value, Error>>

const promise2 = (val: number) =>
  new Promise(
    (resolve, reject) => (
      setTimeout(() => resolve(`Resolved: ${val}`), val * 10),
      setTimeout(() => reject(`Rejected: ${val}`), val * 2) // change to 9 to see the difference
    ),
  )

Result.fromPromise(promise2(2)) //?

/// TS Pattern interop
// https://github.com/gvergnaud/ts-pattern
// Pattern Matching is a code-branching technique coming from functional programming languages,
// which lets you scrutinize the structure of values in a declarative way.
// It has proven itself to be less verbose and more powerful than imperative alternatives (if/else/switch statements),
// especially when branching on complex data structures or on several values.

import {match, P} from 'ts-pattern'

match(resultO)
  .with(Result.pattern.Ok(P.select()), value => value)
  .with(Result.pattern.Error(P.select()), error => {
    console.error(error)
    return 'fallback'
  })
  .exhaustive() //?
