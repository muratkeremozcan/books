// https://www.educative.io/courses/functional-programming-patterns-with-ramdajs/xV9vlmDPJAE
import * as R from 'ramda'
import {merge} from 'lodash'

// lodash merge vs spread
{
  const obj1 = {a: 1, b: 2}
  const obj2 = {b: 3, c: 4}

  // lodash can deep merge, that's the catch
  const mergedLodash = merge(obj1, obj2)
  mergedLodash //?

  const mergedVanilla = {...obj1, ...obj2}
  mergedVanilla //?
}

// key: mutate a copy of the input, not the input itself

// bad: the variable mutates because the fn makes a var assignment
const impureAssoc = (
  key: string,
  value: number,
  object: {[x: string]: any; name?: string},
) => {
  object[key] = value
}

const person = {name: 'Bob'}
impureAssoc('shoeSize', 400, person)
person //?

// good: return the new object instead of var assignment
const pureAssoc = (key: string, value: number, object: {name: string}) => ({
  ...object,
  [key]: value,
})

const person2 = {name: 'Bob'}
pureAssoc('shoeSize', 400, person2) //?
person2 //?

////////// exercises

/// array map vs R.map
type User = {name: string; age: number}
const users: User[] = [
  {name: 'Bob', age: 20},
  {name: 'Alice', age: 21},
]

// native map vs R.map
// with Ramda the callback comes first, and the data comes later. the data can also be passed a curried arg (preferred)
// R.prop('propertyName') is a function that takes an object and returns the value of the property
const getNamesV0 = (users: any[]) => users.map((user: {name: any}) => user.name) // data => data.map(callback)
const getNamesR1 = R.map(user => user.name, users) // R.map(callback, data)          - notice no extra data arg with Ramda
const getNamesR2 = R.map((user: User) => user.name) ///////// R.map(callback)                - better curried, pass the arg later
const getNamesR3 = R.map(R.prop('name')) //////////// R.map(R.prop('propertyName'))  - better version
const getNamesR4 = R.pluck('name') //////////////// R.pluck('propertyName') - shorthand for R.map(R.prop('propertyName'))

getNamesV0(users) //?
getNamesR1 //?
getNamesR2(users) //?
getNamesR3(users) //?
getNamesR4(users) //?

/// purify array push
const list = [1, 2, 3, 4, 5]
const list2 = [1, 2, 3, 4, 5]

const append = (item: number, list: any[]) => {
  list.push(item)
  return list
}

append(6, list) //?
// bad; the list is mutated
list //?

// key: mutate a copy of the input, not the input itself
const appendPure = (item: number, list: number[]) => [...list, item]

appendPure(6, list2) //?
// good; the list is not mutated
list2 //?

// purify array sort
const numbers = [3, 1, 5, 54, 2, 7, 8]
const numbers2 = [3, 1, 5, 54, 2, 7, 8]
const numbers3 = [3, 1, 5, 54, 2, 7, 8]

const sortAscending = (numbers: any[]) =>
  numbers.sort((a: number, b: number) => a - b)
sortAscending(numbers) //?
// bad; the list is mutated
numbers //?

// key: mutate a copy of the input, not the input itself
const sortAscendingPure = (numbers: number[]) =>
  [...numbers].sort((a, b) => a - b)
sortAscendingPure(numbers2) //?
// good; the original array stays the same
numbers2 //?

const sortAscendingPureR1 = R.sort((a: number, b: number) => a - b)
const sortAscendingPureR2 = R.sortBy(R.identity)

sortAscendingPureR1(numbers3) //?
sortAscendingPureR2(numbers3) //?

numbers3 //?
