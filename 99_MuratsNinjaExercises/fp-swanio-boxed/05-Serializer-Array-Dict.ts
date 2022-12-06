import {Serializer, AsyncData, Option, Array, Dict} from '@swan-io/boxed'

//// Serializer
// enables you to serialize some Boxed values
// (e.g. to store in LocalStorage, or to hydrate data from SSR).

/// Serializer.encode(value)
// stringifies the input to JSON,
// managing the AsyncData, Option and Result types properly.

Serializer.encode({
  data: AsyncData.Done({
    name: Option.None(),
  }),
}) //?

/// Serializer.decode(value)
// parse the JSON input, reviving the AsyncData, Option and Result types properly.

Serializer.decode(`{"__boxed_type__":"Option","tag":"None"}`) //?

//// Array

/// Array.keepMap(array, func)
// returns an array containing the Option.Some values return by func for each array item.
// This function can be useful to refine the types of an array.
const isEven = (n: number) => n % 2 === 0
const arr = [1, 2, 3, 4, 5]

Array.keepMap(arr, x => (isEven(x) ? Option.Some(x) : Option.None())) //?

/// Array.getBy(array, predicate)
// Return the first item in the array for which predicate returns true.
// The function returns an Option so that we can distinguish between a found nullish value and a not found value.

Array.getBy(arr, isEven) //?

/// Array.getIndexBy(array, predicate)
// returns the first index in the array for which predicate returns true
// the function returns an Option

Array.getIndexBy(arr, isEven) //?

/// Array.binarySearchBy(sortedArray, item, compare)
// performs a binary search on the array
// returns the index of the item if there's an exact match,
// returns the index of the first superior value if not. Return -1 if the array is empty.

Array.binarySearchBy(arr, 5) //?
Array.binarySearchBy(arr, 6) //?

/// Array.zip(array1, array2)
// Create an array of pairs from two arrays.
const arr2 = ['one', 'two', 'three', 'four', 'five']

Array.zip(arr, arr2) //?

/// Array.unzip(arrayOfPairs)
// Turns an array of pairs into two arrays.

Array.unzip([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]) //?

// // Array.from(arrayLike)
// Array.from, reexported for convenience when Boxed Array shadows the Array constructor in scope.

Array.from({length: 3}, (_, key) => key) // [0, 1, 2]

/// Array.of(...items)
// Array.of, reexported for convenience when Boxed Array shadows the Array constructor in scope.

Array.of(1, 2, 3) //?

/// Array.isArray(value)
// Array.isArray, reexported for convenience when Boxed Array shadows the Array constructor in scope.

Array.isArray('') //?

Array.isArray([1, 2, 3]) //?

//// Dict
// Dict.entries(dict)
// Returns the entries in the dict, object to array of arrays
// Contrary to the TS bindings for Object.entries, the types are refined.

Dict.entries({foo: 1, bar: 2, baz: 3}) //?

/// Dict.keys(dict)
// Returns the keys in the dict.

Dict.keys({foo: 1, bar: 2, baz: 3}) //?

/// Dict.values(dict)
// Returns the values in the dict.

Dict.values({foo: 1, bar: 2, baz: 3}) //?
