// Ramda: It is more focused on functional utilities that make it easier to work with JavaScript in a functional style.
// It provides a range of functions for list transformations, function composition, and other typical functional programming operations.
// However, it doesn't delve deeply into the type-level abstractions and monadic structures that are prevalent in more strongly-typed functional languages.

// fp-ts: It fills the gap by providing more advanced functional programming constructs like Either, Option, IO, Task, and more.
// These constructs allow for more advanced patterns like error handling, asynchronous operations, and side-effect management in a functional style,
//  with the added benefit of type safety

import {none, some, fold as foldOption, fromNullable} from 'fp-ts/Option'
import {Either, tryCatch, fold as foldEither} from 'fp-ts/Either'
import {IOEither, tryCatch as tryCatchIO} from 'fp-ts/IOEither'
import {IO} from 'fp-ts/IO'
import type {Option} from 'fp-ts/Option'
import * as fs from 'fs'
import {Task} from 'fp-ts/Task'
import {TaskEither, tryCatch as tryCatchTaskEither} from 'fp-ts/TaskEither'

// https://dev.to/gcanti/interoperability-with-non-functional-code-using-fp-ts-432e

/////////////////////// # 1. Sentinels -> Option none & some
/* 
Use case: an API that may fail and returns a special value.

Problem with Sentinels: Using special values (like -1 in this case)
as sentinels to indicate failure or a special condition can lead to errors if not handled properly.
For example, a programmer might forget to check for -1 and erroneously use it as a valid array index.

Example: Array.prototype.findIndex

the Functional Programming Solution: Option Type
To handle these kinds of scenarios more safely and expressively, functional programming languages
(and libraries like fp-ts in TypeScript) introduce the concept of Option types.

How Option Works: An Option type can have one of two values: Some(value) or None.
Some(value) represents a successful outcome (like finding an index), 
while None represents an absence of value (like not finding an index).

Benefits: This approach forces the developer to explicitly handle both success (Some) and failure (None) cases,
reducing the risk of errors due to unhandled conditions.
*/

/**
 * Safely searches for the index of the first element in an array that satisfies a provided testing function.
 *
 * @param {Array<A>} arr - The array to search within.
 * @param {(a: A) => boolean} predicate - A function to test each element of the array.
 * @returns {Option<number>} - An Option type that is:
 *         - `some(index)` if an index of an element satisfying the predicate is found, or
 *         - `none` if no such element is found.
 *
 * This function wraps the standard Array.prototype.findIndex behavior in an Option type.
 * Instead of returning -1 to indicate that no element satisfies the predicate, it returns `none`.
 * This approach enhances safety and expressiveness by making the absence of a satisfying element explicit.
 */
function findIndex<A>(arr: Array<A>, predicate: (a: A) => boolean): Option<number> {
  const index = arr.findIndex(predicate)
  return index === -1 ? none : some(index)
}

// Example usage
const array = [1, 2, 3, 4, 5]
const predicate = (x: number) => x > 3

const resultFindIndex = findIndex(array, predicate) //?

// Handling the result safely
const handleResultOption = foldOption(
  () => null, // Handle None case
  (value: number | string) => value, // Handle Some case
)
handleResultOption(resultFindIndex) //?

/////////////////////// # 2. undefined and null -> Option fromNullable

/*
Use case: an API that may fail and returns undefined (or null).
This is common when retrieving elements from arrays, objects, or when querying databases, APIs, etc.

Traditional Approach Challenges:
Ambiguity and Risk: The use of undefined or null can be ambiguous and error-prone. 
It's easy to forget to check for these values, leading to runtime errors like TypeError: Cannot read property 'x' of undefined.
Inconsistent Handling: Different APIs may use undefined, null, or both, leading to inconsistent error handling in the code.

Example: Array.prototype.find

the Functional Programming Solution: Option Type and fromNullable Function 
fp-ts provides a function called fromNullable, which takes a value that might be null or undefined 
and converts it into an Option. This ensures a consistent way to handle optional values.
*/

/**
 * Safely searches for an element in an array that satisfies a provided testing function.
 *
 * @param {Array<A>} arr - The array to search within.
 * @param {(a: A) => boolean} predicate - A function to test each element of the array.
 * @returns {Option<A>} - An Option type that is:
 *         - `some(element)` if an element satisfying the predicate is found, or
 *         - `none` if no such element is found.
 *
 * This function enhances the standard Array.prototype.find by returning an Option type,
 * making the handling of absent values more explicit and safer. The `fromNullable` utility
 * from fp-ts is used to convert potentially undefined results into an Option type.
 */
const find = <A>(arr: Array<A>, predicate: (a: A) => boolean): Option<A> =>
  fromNullable(arr.find(predicate))

// Example usage
const resultFind = find(array, predicate) //?

handleResultOption(resultFind) //?

/////////////////////// # 3. Exceptions -> Either, tryCatch
/*
Use case: an API that may throw.
In many programming scenarios, especially when dealing with external libraries or APIs, there's a risk of encountering exceptions. 
These exceptions disrupt the normal flow of the program and need to be handled appropriately to maintain application stability.

Traditional Approach Challenges:
Disruptive Flow: Exceptions, by their nature, interrupt the normal execution flow, which can lead to unhandled scenarios and application crashes.
Manual Try-Catch Blocks: Typically, exceptions are handled using try-catch blocks. 
However, this can lead to verbose and nested code, especially when dealing with multiple potential exception points.

Example: JSON.parse

the Functional Programming Solution: Either, tryCatch
In functional programming, the Either type is used to represent a value that could be one of two types: 
a "right" value indicating success, or a "left" value indicating failure (often an error).
tryCatch Function: The fp-ts library provides a tryCatch function. 
It executes a piece of code and, if it throws an exception, catches it and returns it as a left value. 
If no exception is thrown, the result is returned as a right value.
*/

/**
 * Safely parses a JSON string into an object.
 *
 * @param {string} s - The JSON string to parse.
 * @returns {Either<Error, unknown>} - An Either type that is:
 *         - a "left" containing an Error if parsing fails, or
 *         - a "right" containing the parsed object if successful.
 *
 * This function uses the fp-ts library's tryCatch to handle exceptions.
 * It provides a functional approach to error handling, encapsulating the
 * potential exception in an Either type. This makes error handling more explicit
 * and integrated into the functional flow.
 */
const parse = (s: string): Either<Error, unknown> =>
  tryCatch(
    () => JSON.parse(s),
    reason => new Error(String(reason)),
  )

// Example usage
const jsonString = '{"name": "John", "age": 30}'
const parseResult = parse(jsonString) //?

const handleResultEither = foldEither(
  (error: Error) => `Error occurred: ${error.message}`, // Handle left case (Error)
  (data: unknown) => data, // Handle right case (Success)
)

handleResultEither(parseResult) //?

///////////////////////// # 4. Random values -> IO monad
/*
Use case: an API that returns a non deterministic value.
In programming, there are scenarios where functions return non-deterministic values, 
meaning their output can vary each time they are called, even with the same input. 
This is typical with functions like Math.random.

Predictability: These functions make it hard to reason about the code, as they introduce side effects and unpredictability.
Testing Difficulty: Non-deterministic behavior can complicate testing and debugging.

Example: Math.random

the Functional Programming Solution: IO monad
the IO monad is used to encapsulate side effects and defer their execution. This makes side effects explicit and controlled.
IO separates the definition of a side effect from its execution, allowing for more predictable and maintainable code.
*/

/**
 * Represents a non-deterministic operation that generates a random number.
 *
 * @returns {IO<number>} - An IO monad that, when executed, will produce a random number.
 *
 * The IO monad encapsulates the side effect of generating a random number, separating
 * the definition of this side effect from its execution. This makes the random number
 * generation explicit, controlled, and more predictable in the context of functional programming.
 * It is particularly useful for maintaining purity and testability in functional code.
 */
const random: IO<number> = () => Math.random()

const randomNumber = random()
randomNumber //?

///////////////////////// # 5. Synchronous side effects - IO monad, IOEither, tryCatch
/*
Use case: an API that reads and/or writes to a global state.
In many applications, there's a need to interact with global states or perform synchronous side effects, 
such as reading from or writing to the localStorage in web applications.
These operations can affect the global state and are not pure functions, as their output depends on the external state.

Impurity: Direct interaction with global states like localStorage makes functions impure, 
leading to unpredictability and difficulties in testing.
Side Effects: These operations produce side effects that can complicate the code's reasoning and flow, 
especially in a functional programming paradigm.

Example: localStorage.getItem

the Functional Programming Solution: IO monad
In functional programming, the IO monad is used to encapsulate side effects, making them explicit and controlled.
Purpose: IO allows for the definition of a side effect to be separated from its execution, 
making the code more predictable and maintainable.
*/

/**
 * Creates an IO monad to safely read a value from the localStorage.
 *
 * @param {string} key - The key of the localStorage item to retrieve.
 * @returns {IO<Option<string>>} - An IO monad that, when executed, will attempt to retrieve
 *                                 the item from localStorage and wrap the result in an Option.
 *
 * This function addresses the side effect of reading from a global state (localStorage) in a controlled manner.
 * The use of IO monad encapsulates the side effect, and the Option type handles the potential absence of the item,
 * enhancing the function's safety and predictability.
 */
const getItem =
  (key: string): IO<Option<string>> =>
  () =>
    fromNullable(localStorage.getItem(key))

// Example usage
const key = 'userSettings'
// Defining the IO operation
const getItemIO = getItem(key) //?
// Executing the IO operation to get the item from localStorage
const item = getItemIO() //?
const getItemResult = handleResultOption(item)
getItemResult //?

// another example
/*
Use case: an API that reads and/or writes to a global state and may throw.

Example: readFileSync

Solution: IOEither, tryCatch
*/
const readFileSync = (path: string): IOEither<Error, string> =>
  tryCatchIO(
    () => fs.readFileSync(path, 'utf-8'),
    reason => new Error(String(reason)),
  )

const path = './phoneNumbers.txt'

// Defining the IO operation
const readFileIO = readFileSync(path) //?
// Executing the IO operation to read the file
const read = readFileIO() //?
handleResultEither(read) //?

///////////////////////// # 6 Asynchronous side effects -> Task, TaskEither, tryCatch
/*
Use case: an API that performs an asynchronous computation.
In modern programming, especially in web development, asynchronous computations are essential. 
These computations are operations that happen over a period of time,
like fetching data from a server or reading user input asynchronously. 
Handling these operations effectively and safely is crucial for building robust applications.

Uncertainty and Complexity: Asynchronous operations can complete at any time, introducing complexity in managing their states and results.
Error Handling: Asynchronous computations can fail or reject, and handling these scenarios gracefully is vital for application stability.
Side Effects: These operations often involve side effects, which can be challenging to manage in a functional programming paradigm.

Functional Programming Solution: Task and TaskEither
Task Type: In fp-ts, a Task represents an asynchronous computation that eventually produces a result. 
It encapsulates an operation that will execute in the future, providing a way to manage side effects in a lazy and controlled manner.
TaskEither Type: Combines Task with Either to handle asynchronous operations that might fail. 
It represents an asynchronous computation that might result in a left (error) or a right (success).
*/

/**
 * Creates a Task that resolves with a message after a specified delay.
 *
 * @param {number} ms - The delay in milliseconds before the task resolves.
 * @param {string} message - The message to be returned after the delay.
 * @returns {Task<string>} - A Task that resolves with the given message after the delay.
 *
 * This function demonstrates handling an asynchronous side effect with a delay,
 * returning a specific result (message) after the delay completes.
 */
const delayedMessage =
  (ms: number, message: string): Task<string> =>
  () =>
    new Promise(resolve => setTimeout(() => resolve(message), ms))

// Example usage
const delayTask = delayedMessage(2000, 'hello')
delayTask().then(res => {
  res //?
  console.log(res)
})

// another example
/*
Use case: an API that performs an asynchronous computation and may reject.

Example: fetch

Solution: TaskEither, tryCatch
*/

/**
 * Performs a GET request to the specified URL.
 *
 * @param {string} url - The URL to send the GET request to.
 * @returns {TaskEither<Error, string>} - A TaskEither that encapsulates the fetch operation.
 *                                        It returns a 'right' with the response text if successful,
 *                                        or a 'left' with an Error if the operation fails.
 *
 * This function uses TaskEither to represent an asynchronous fetch operation
 * in a functional way, handling both success and failure scenarios.
 */
const get = (url: string): TaskEither<Error, string> =>
  tryCatchTaskEither(
    () => fetch(url).then(res => res.text()),
    reason => new Error(String(reason)),
  )

// Defining the TaskEither operation
const getTask = get('https://jsonplaceholder.typicode.com/todos/1') //?

// Executing the TaskEither operation to perform the GET request
getTask().then(result => {
  handleResultEither(result) //?
})
