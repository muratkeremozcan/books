import * as R from 'ramda'

///// Generics

// before
/*
	function map(items, mappingFunction) {
  const results = []
  for (let item of items) {
    results.push(mappingFunction(item))
  }
  return results
}

const persons = [{name: 'John'}, {name: 'Alice'}]
console.log(map(persons, person => person.name))
*/

/// Generic types (relations between parameter types and return type)
// T[] still means that it is an array of anything.
// lets us establish relationships between types of function parameters and the return type

{
  function map<TElement, TResult>(
    items: TElement[],
    mappingFunction: (item: TElement) => TResult,
  ): TResult[] {
    const results = []
    for (let item of items) {
      results.push(mappingFunction(item))
    }
    return results
  }

  const persons = [{name: 'John'}, {name: 'Alice'}]
  map(persons, person => person.name) //?
}

/// Exercise: at types to the function below
/*
function zip(array1, array2) {
  const length = Math.min(array1.length, array2.length)
  const result = []
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]])
  }
  return result
}
*/
function zip<T, K>(array1: T[], array2: K[]) {
  const length = Math.min(array1.length, array2.length)
  const result = []
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]])
  }
  return result
}

/// Type Arguments (relations between parameter types, where you have an array/object and its keys)
// ex:  when typing a function that takes an object and a string (obj[key])
// use two type arguments: T and K. We can put a constraint on K and require it to extend keyof T
{
  function get<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
  }

  type Person = {
    name: string
    age: number
  }

  const person: Person = {
    name: 'John',
    age: 23,
  }

  get(person, 'name') //?
  get(person, 'age') //?
  // get(person, 'foo')  // error

  ////// exercise

  /*
  function pick(array, key) {
    const results = []
    for (let element of array) {
      results.push(element[key])
    }
    return results
  }
  */
  function pick<T, K extends keyof T>(array: T[], key: K) {
    const results = []
    for (let element of array) {
      results.push(element[key])
    }
    return results
  }
}

const getIds = R.map(R.prop('id'))
