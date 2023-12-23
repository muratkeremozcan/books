import {none, some, fold, fromNullable} from 'fp-ts/Option'
import type {Option} from 'fp-ts/Option'

// https://dev.to/gcanti/interoperability-with-non-functional-code-using-fp-ts-432e

// # Sentinels
/* 
Use case: an API that may fail and returns a special value
which is common in many APIs and standard library functions.
Problem with Sentinels: Using special values (like -1 in this case)
as sentinels to indicate failure or a special condition can lead to errors if not handled properly.
For example, a programmer might forget to check for -1 and erroneously use it as a valid array index

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
 * Wraps the standard findIndex behavior in an Option type.
 * Instead of returning -1 when an item is not found, it returns none.
 * When an item is found, it returns some(index).
 * This makes the function safer and its return value more explicit.
 */
function findIndex<T>(arr: Array<T>, predicate: (a: T) => boolean): Option<number> {
  const index = arr.findIndex(predicate)
  return index === -1 ? none : some(index)
}

// Example usage
const array = [1, 2, 3, 4, 5]
const predicate = (x: number) => x > 3

const result = findIndex(array, predicate)
result // { _tag: 'Some', value: 3 }

// Handling the result safely
const handleResult = fold(
  () => null, // Handle None case
  (value: number) => value, // Handle Some case
)
handleResult(result) //?

// # undefined and null

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
 * Encapsulates the behavior of Array.prototype.find but returns an Option type instead of possibly undefined.
 * uses fromNullable to convert the result of the find operation into an Option.
 * If find returns undefined (meaning no item was found), fromNullable will return none.
 * Otherwise, it wraps the found value in some.
 */
function find<A>(arr: Array<A>, predicate: (a: A) => boolean): Option<A> {
  return fromNullable(arr.find(predicate))
}

const result2 = find(array, predicate)
result2 // { _tag: 'Some', value: 4 }

handleResult(result2) // 4
