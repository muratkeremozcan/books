import {fromNullable, Option} from 'fp-ts/Option'
import {type IO, map, getMonoid} from 'fp-ts/IO'
import {pipe} from 'fp-ts/function'
import {log} from 'fp-ts/Console'

// https://dev.to/gcanti/getting-started-with-fp-ts-io-36p6

/* In fp-ts a synchronous effectful computation is represented by the IO type
read / write to localStorage
get the current time
write to the console
get a random number


*/
// read / write to localStorage
const getItem =
  (key: string): IO<Option<string>> =>
  () =>
    fromNullable(localStorage.getItem(key))

const setItem =
  (key: string, value: string): IO<void> =>
  () =>
    localStorage.setItem(key, value)

// get the current time
const now: IO<number> = () => new Date().getTime()
now() //?

//  write to the console
// const log =
//   (s: unknown): IO<void> =>
//   () =>
//     console.log(s)

// The IO type admits a Monad instance, so you can map

const random: IO<number> = () => Math.random()
// get a random boolean

const randomBool: IO<boolean> = pipe(
  random,
  map(n => n < 0.5),
)

const program: IO<void> = pipe(randomBool, log)

// Note that nothing happens until you call program().
// That's because program is a value which just represents an effectful computation,
// so in order to execute any side effect you must "run the IO action".
program() //?
