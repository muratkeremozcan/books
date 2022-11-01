import {Option, Result, AsyncData} from '@swan-io/boxed'
// https://swan-io.github.io/boxed/async-data

// The AsyncData type enables representing asynchronous flows (e.g. requests).
// The type represents the state as a discriminating union,
// avoiding manual management for loading flows.

// AsyncData can have three possible states:
// * NotAsked
// * Loading
// * Done(value)

AsyncData.NotAsked() //?
AsyncData.Loading() //?
AsyncData.Done(1) //?

//// Data Manipulation
// KEY: map and flatMap functions allow you to transform data in a typesafe way
// use map when returning a normal value,
// user flatMap when we're returning another Box (Container-Functor-Monad)

/// map(f)
AsyncData.Done(2).map(x => x * 2) //?
AsyncData.Loading().map(x => x * 2) //?
AsyncData.NotAsked().map(x => x * 2) //?

/// flatMap(f)
AsyncData.Done(3).flatMap(x =>
  x > 2 ? AsyncData.NotAsked() : AsyncData.Done(2),
) //?
AsyncData.Done(1).flatMap(x =>
  x > 2 ? AsyncData.NotAsked() : AsyncData.Done(2),
) //?

AsyncData.NotAsked().flatMap(x =>
  x > 2 ? AsyncData.NotAsked() : AsyncData.Done(2),
) //?

AsyncData.Loading().flatMap(x =>
  x > 2 ? AsyncData.NotAsked() : AsyncData.Done(2),
) //?

/// getWithDefault(defaultValue)
// If the async data is Done(value) returns value, otherwise returns defaultValue.

AsyncData.Done(2).getWithDefault(1) //?
AsyncData.Loading().getWithDefault(1 as never) //?
AsyncData.NotAsked().getWithDefault(1 as never) //?

/// get()
// return the value contained in Done(value). Only usable within a isDone() check

/// isDone(), isLoading(), isNotAsked()
// Type guards to check the state of the AsyncData

AsyncData.Done(2).isDone() //?
AsyncData.Loading().isLoading() //?
AsyncData.NotAsked().isNotAsked() //?

const asyncdata = AsyncData.Done<number | string>(2) // toggle between the 3 states
// const asyncdata = AsyncData.Loading()
// const asyncdata = AsyncData.NotAsked()

if (asyncdata.isDone()) {
  asyncdata.get() //?
}

/// toOption()
// converts AsyncData to Option

AsyncData.Done(2).toOption() //?
AsyncData.Loading().toOption() //?
AsyncData.NotAsked().toOption() //?

// note that there is no toResult(), you can convert to Option first then to Result
AsyncData.Done(2).toOption().toResult('not found') //?
Result.fromOption(AsyncData.Done(2).toOption(), 'not found') //?

/// there are some result helpers instead
// A AsyncData can contain a Result (e.g. to represent an asynchronous value that can fail).
// We provide some utility functions to deal with that case without having to unwrap the AsyncData result.

/// mapResult(f)
// converts AsyncData to Result

const isEven = (x: number) => x % 2 === 0

AsyncData.Done(Result.Ok(3)).mapResult(ok => Result.Ok(ok * 2)) //?
AsyncData.Done(Result.Ok(3)).mapResult(ok =>
  isEven(ok) ? Result.Ok(ok) : Result.Error('Odd number'),
) //?

/// mapOk(f)
// converts AsyncData to Result.Ok
AsyncData.Done(Result.Ok(3)).mapOk(ok => ok * 2) //?

AsyncData.Done(Result.Error('something')).mapOk(ok => ok * 2) //?

/// mapError(f)
// converts AsyncData to Result.Error
AsyncData.Done(Result.Ok('something')).mapError(ok => ok * 2) //?
AsyncData.Done(Result.Error(3)).mapError(error => error * 2) //?

/// flatMapOk(f)
// converts AsyncData to Result.Ok, flattens
AsyncData.Done(Result.Ok(3)).flatMapOk(ok => AsyncData.Done(Result.Ok(ok * 2))) //?

AsyncData.Done(Result.Ok(3)).flatMapOk(() =>
  AsyncData.Done(Result.Error('Nope')),
) //?

AsyncData.Done(Result.Error('Error')).flatMapOk(ok =>
  AsyncData.Done(Result.Ok(ok * 2)),
) //?

/// flatMapError(f)
// converts AsyncData to Result.Error, flattens
AsyncData.Done(Result.Ok(3)).flatMapError(error =>
  AsyncData.Done(Result.Ok(error * 2)),
) //?

AsyncData.Done(Result.Error('Error')).flatMapError(() =>
  AsyncData.Done(Result.Error('Nope')),
) //?

AsyncData.Done(Result.Error('Error')).flatMapError(() =>
  AsyncData.Done(Result.Ok(1)),
) //?

/// match()
// match the AsyncData state

const valueToDisplay = asyncdata.match({
  Done: value => value,
  Loading: () => 'loading...',
  NotAsked: () => 'not asked',
})
valueToDisplay //?

/// tap(f)
// for logging and debugging

asyncdata.tap(value => {
  console.log(value)
}) //?
asyncdata.tap(console.log) //?

/// all(asyncdatas)
// array of AsyncData to one AsyncData

AsyncData.all([AsyncData.Done(1), AsyncData.Done(2), AsyncData.Done(3)]) //?
AsyncData.all([AsyncData.NotAsked(), AsyncData.Done(2), AsyncData.Done(3)]) //?
AsyncData.all([AsyncData.Loading(), AsyncData.Done(2), AsyncData.Done(3)]) //?

/// allFromDict(asyncdatas)
AsyncData.allFromDict({
  a: AsyncData.Done(1),
  b: AsyncData.Done(2),
  c: AsyncData.Done(3),
}) //?
AsyncData.allFromDict({
  a: AsyncData.NotAsked(),
  b: AsyncData.Done(2),
  c: AsyncData.Done(3),
}) //?
AsyncData.allFromDict({
  a: AsyncData.Loading(),
  b: AsyncData.Done(2),
  c: AsyncData.Done(3),
}) //?

/// TS Pattern interop
// https://github.com/gvergnaud/ts-pattern
// Pattern Matching is a code-branching technique coming from functional programming languages,
// which lets you scrutinize the structure of values in a declarative way.
// It has proven itself to be less verbose and more powerful than imperative alternatives (if/else/switch statements),
// especially when branching on complex data structures or on several values.

import {match, P} from 'ts-pattern'

match(asyncdata)
  .with(AsyncData.pattern.Done(P.select()), value => value)
  .with(AsyncData.pattern.Loading, () => 'Loading')
  .with(AsyncData.pattern.NotAsked, () => '')
  .exhaustive()
