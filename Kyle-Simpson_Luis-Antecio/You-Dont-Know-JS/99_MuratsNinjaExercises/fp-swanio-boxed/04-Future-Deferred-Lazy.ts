import {Future, Deferred, Result} from '@swan-io/boxed'

// Future is a replacement for Promise.

// Main differences with Promises:
// Futures don't handle rejection state, instead leaving it to a contained Result
// Futures have built-in cancellation (and don't reject like the fetch signal API does)
// Futures don't "swallow" futures that are returned from map and flatMap
// Future callbacks run synchronously

Future.value(1) //?
Future.make(resolve => resolve(1)) //?

/// Cancellation
// In JavaScript, Promises are not cancellable.
// That can be limiting at times, especially when using React's useEffect,
// that let's you return a cancellation effect in order to prevent unwanted side-effects.

// You can return a cleanup effect from the future init function:
const future = Future.make(resolve => {
  const timeoutId = setTimeout(() => {
    resolve('hello there')
  }, 1000)
  // will run on cancellation
  return () => clearTimeout(timeoutId)
})

// future.cancel() // TOGGLE to see it in action

/// tap(f)
future.tap(x => {
  return x //?
})

/// onResolve(f)
// Runs f with the future value as argument when available.

future.onResolve(x => {
  return x //?
})

/// onCancel(f)
// Runs f when future is cancelled
Future.value(3).onCancel(() => console.log('cancelled')) //?
future.onCancel(() => {
  console.log('got cancelled')
})

/// map(f)
// Takes a Future<A> and returns a new Future<f<A>>
Future.value(3).map(x => x * 2) //?

// flatMap(f)
// Takes a Future<A>, works on a Future, returns f(A)
Future.value(3).flatMap(x => Future.value(x * 2)) //?

/// toPromise()
// converts a Future<T> to a Promise<T>
Future.value(5).toPromise() //?

/// resultToPromise()
Future.value(Result.Ok(1)).resultToPromise() //?
Future.value(Result.Error(1)).resultToPromise() //?

/// fromPromise()
// Takes a Promise<T> and returns a Future<Result<T, Error>>
Future.fromPromise(Promise.resolve(1)).onResolve(x => {
  return x //?
})

Future.fromPromise(Promise.reject(1)).onResolve(x => {
  return x //?
})

/// Future.all
// takes an array of Futures, returns one Future
Future.all([Future.value(1), Future.value(2), Future.value(3)]) //?

/// Future.all to Result.all
// you can combine all helpers from Future and Result
const futures = [
  Future.value(Result.Ok(1)),
  Future.value(Result.Ok(2)),
  Future.value(Result.Ok(3)),
]
Future.all(futures).map(Result.all) //?

/// Future.allFromDict
// takes a dict of Futures, returns one Future
Future.allFromDict({
  a: Future.value(1),
  b: Future.value(2),
  c: Future.value(3),
}) //?

/// Future.allFromDict to Result.allFromDict
const futures2 = {
  a: Future.value(Result.Ok(1)),
  b: Future.value(Result.Ok(2)),
  c: Future.value(Result.Ok(3)),
}
Future.allFromDict(futures2).map(Result.allFromDict) //?

/// Bubbling cancellation
// All .map* and .flatMap* methods take an extra parameter called propagateCancel,
// it enables the returned future cancel to bubble up cancellation to its dependencies

// disabled by default: cancelling `future2` will not cancel `future`
const future5 = Future.value(5).map(x => x * 2)
future5 //?

// option: will cancel `future`
const future6 = Future.value(6).map(x => x * 2, true) //?
future6.cancel()
future6 //?
/* example:
const request = apiCall().map(parse, true);
request.cancel(); // will run the cleanup effect in `apiCall`
*/

//// Future to Result
// A Future can contain a Result (e.g. to represent an asynchronous value that can fail).
// We provide some utility functions to deal with that case without having to unwrap the Future result.

/// mapResult(f)
// Takes a Future<Result<Ok, Error>> and a f function taking Ok and returning Result<ReturnValue, Error>
// returns a new Future<Result<ReturnValue, Error>>

Future.value(Result.Ok(3)).mapResult(ok => Result.Ok(ok)) //?

const isEven = (x: number) => x % 2 === 0
Future.value(Result.Ok(3)).mapResult(ok =>
  isEven(ok) ? Result.Ok(ok) : Result.Error('odd number'),
) //?

/// mapOk(f)
// like mapResult, but to Ok instead of uncertain

Future.value(Result.Ok(3)).mapOk(ok => Result.Ok(ok)) //?
Future.value(Result.Error('something')).mapOk(ok => ok * 2) //?

// mapError(f)
// like mapResult, but to Error instead of uncertain

Future.value(Result.Error(3)).mapError(error => error * 2) //?

Future.value(Result.Ok('something')).mapError(ok => ok * 2) //?
// Future<Result.Ok<"something">>

/// flatMapOk(f)
// like mapOk, but works on a Future
Future.value(Result.Ok(3)).flatMapOk(ok => Future.value(Result.Ok(ok * 2))) //?
Future.value(Result.Ok(3)).flatMapOk(() => Future.value(Result.Error('Nope'))) //?
Future.value(Result.Error('Error')).flatMapOk(ok =>
  Future.value(Result.Ok(ok * 2)),
) //?

/// tapOk(f)
/// tapError(f)
Future.value(Result.Ok(7)).tapOk(console.log) //?
Future.value(Result.Error('tap Error')).tapError(console.log) //?

/// Deferred
// Returns a Future and its resolver
const [future10, resolve] = Deferred.make<string>()

// subscribe to the future
future10.onResolve(x => {
  x //?
  return x
})
// resolve('hello') //? // toggle to see it working
