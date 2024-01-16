import {
  type Task,
  of,
  sequenceArray,
  sequenceSeqArray,
  delay,
  map,
  ApplyPar,
  chain,
  traverseArray,
} from 'fp-ts/Task'
import {tryCatch} from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {fold} from 'fp-ts/Either'
import {sequenceT, sequenceS} from 'fp-ts/apply'

/////////////// Tasks that always succeed
// If you're working with asynchronous tasks that are guaranteed to succeed, use Task

const deepThought: Task<number> = () => Promise.resolve(42)

deepThought().then(n => {
  console.log('the answer to life, the universe, and everything is', n)
  n //?
})

/////////////////// Tasks that may fail
// If you're working with asynchronous tasks that may fail, use TaskEither
// If the JSON in this example is malformed (try it!), an "I'm sorry" message is displayed.

const fetchGreeting = tryCatch<Error, {name: string}>(
  () => Promise.resolve(JSON.parse('{ "name": "Carol" }')),
  reason => new Error(String(reason)),
)

fetchGreeting().then(e =>
  pipe(
    e,
    fold(
      err => `I'm sorry, I don't know who you are. (${err.message})`,
      x => `Hello, ${x.name}!`,
    ),
  ),
) //?

///////////////// Work with a list of tasks in parallel

// JS provides Promises.all to wait for a list of Promises.

Promise.all([Promise.resolve(1), Promise.resolve(2)]) //?

// With Tasks you can achieve the same using sequence
// Both the Promise.all and the sequence approach run in parallel and wait until all results have arrived before they proceed

sequenceArray([of(1), of(2)])() //?

///////////////// Run a list of tasks in sequence
// If you need to run a list of Tasks in sequence, i.e. you have to wait for one Task to finish
//  before you run the second Task, you can use the taskSeq instance.

const log = <A>(x: A) => {
  console.log(x)
  return x
}

const tasks = [pipe(delay(200)(of('first')), map(log)), pipe(delay(100)(of('second')), map(log))]

// parallel execution
sequenceArray(tasks)() //?

// sequential execution
sequenceSeqArray(tasks)() //?

///////////////// Work with tasks with different type
// What if the types are different? We can't use sequence anymore.
// sequenceArray[of(1), task.of("hello")] // ts error...
// We can use sequenceT or sequenceS instead.

// type is task.Task<[number, string]>
sequenceT(ApplyPar)(of(1), of('hello'))() //?
// type is task.Task<{ a: number; b: string; }>
sequenceS(ApplyPar)({a: of(1), b: of('hello')})() //?

////////////////// Work with a list of dependent tasks
// If you need the result of on task before you can continue with the next, you can chain the tasks like so:

pipe(
  of(2),
  chain(result => of(result * 3)),
  chain(result => of(result + 4)),
)() //?

////////////////// Traverse: map and sequence
// If you have a list of items that you need to map over before running them in sequence,
// you can use traverseArray, which is a shortcut for doing both operations in one step.

const checkPathExists = (path: string) => () =>
  Promise.resolve({path, exists: !path.startsWith('/no/')})

pipe(['/bin', '/no/real/path'], traverseArray(checkPathExists))() //?

// https://grossbart.github.io/fp-ts-recipes/#/async?id=comparison-with-promise-methods  (nice table)
