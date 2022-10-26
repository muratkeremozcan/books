import {Option, Result, AsyncData} from '@swan-io/boxed'
// Option is like Maybe, additionally like Some(x) / None or Just(x) / Nothing
// https://swan-io.github.io/boxed/option

// You can enforce the type using a type parameter
Option.Some<string>('John') //?
Option.None<string>() //?
Option.fromNullable('John') //?

// null and undefined
Option.fromNullable(null) //?
Option.fromNull(null) //?
Option.fromUndefined(undefined) //?

// The map and flatMap functions transform the data
// map

const some = Option.Some(1) //?
const none = Option.None() //?
const doubledSome = some.map(x => x * 2) //?
const doubledNone = none.map(x => x * 2) //?

Option.Some<number>(2).map(x => x * 2) //?
Option.None().map(x => x * 2) //?

// flatMap is used for nested values
Option.Some(3).flatMap(x => (x > 2 ? Option.None() : Option.Some(2))) //?

Option.Some(1).flatMap(x => (x > 2 ? Option.None() : Option.Some(2))) //?

// getWithDefault
Option.Some(2).getWithDefault(1) //?

// @ts-ignore
Option.None().getWithDefault(1) //?

////
// Result is like Either
// https://swan-io.github.io/boxed/result

const ok = Result.Ok(1) //?
const notOk = Result.Error('something happened') //?

// You can convert an option to a Result:
const a = Result.fromOption(Option.Some(1), 'Not found') //?
const b = Result.fromOption(Option.None(), 'Not found') //?

// The map and flatMap functions transform the data
// map

Result.Ok(2).map(x => x * 2) //?
Result.Ok(2).map(x => Result.Ok(x * 2)) //?

Result.Error(2).mapError(x => x * 2) //?
Result.Error(2).mapError(x => Result.Ok(x * 2)) //?

// flatMap is used for nested values
Result.Ok(1).flatMap(x => (x > 2 ? Result.Error('some error') : Result.Ok(2))) //?
Result.Ok(3).flatMap(x => (x > 2 ? Result.Error('some error') : Result.Ok(2))) //?
Result.Error('initial error').flatMap(x =>
  x > 2 ? Result.Error('some error') : Result.Ok(2),
) //?

//// AsyncData
const notAsked = AsyncData.NotAsked() //?
const loading = AsyncData.Loading() //?
const done = AsyncData.Done(1) //?

// map
AsyncData.Done(2).map(x => x * 2) //?
AsyncData.Loading().map(x => x * 2) //?
AsyncData.NotAsked().map(x => x * 2) //?

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
