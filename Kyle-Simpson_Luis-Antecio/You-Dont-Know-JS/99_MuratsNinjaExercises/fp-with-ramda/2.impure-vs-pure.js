// https://www.educative.io/courses/functional-programming-patterns-with-ramdajs/xV9vlmDPJAE
import * as R from 'ramda'
// key: mutate a copy of the input, not the input itself

// bad: the variable mutates because the fn makes a var assignment
const impureAssoc = (key, value, object) => {
  object[key] = value
}

const person = {name: 'Bob'}
impureAssoc('shoeSize', 400, person)
person //?

// good: return the new object instead of var assignment
const pureAssoc = (key, value, object) => ({
  ...object,
  [key]: value,
})

const person2 = {name: 'Bob'}
pureAssoc('shoeSize', 400, person2) //?
person2 //?

/// exercises

/// array map vs R.map
const users = [
  {name: 'Bob', age: 20},
  {name: 'Alice', age: 21},
]

const getNames = users => {
  console.log('getting names!')
  return users.map(user => user.name)
}
getNames(users) //?

// classic map vs R.map
// with Ramda the callback comes first, and the data comes later. the data can also passed a curried arg (preferred)
// - R.prop('propertyName') is a function that takes an object and returns the value of the property
const getNamesV0 = users => users.map(user => user.name) // data => data.map(callback)
const getNamesR1 = R.map(user => user.name, users) // R.map(callback, data)          - notice no extra data arg with Ramda
const getNamesR2 = R.map(user => user.name) ///////// R.map(callback)                - better curried, pass the arg later
const getNamesR3 = R.map(R.prop('name'), users) ///// R.map(R.prop('propertyName'), data) - R.prop is a nice shorthand
const getNamesR4 = R.map(R.prop('name')) //////////// R.map(R.prop('propertyName'))  - best version

getNamesV0(users) //?
getNamesR1 //?
getNamesR2(users) //?
getNamesR3 //?
getNamesR4(users) //?

/// purify array push
const list = [1, 2, 3, 4, 5]
const list2 = [1, 2, 3, 4, 5]

const append = (item, list) => {
  list.push(item)
  return list
}

append(6, list) //?
// bad; the list is mutated
list //?

// key: mutate a copy of the input, not the input itself
const appendPure = (item, list) => [...list, item]

appendPure(6, list2) //?
// good; the list is not mutated
list2 //?

// purify array sort
const numbers = [3, 1, 5, 54, 2, 7, 8]
const numbers2 = [3, 1, 5, 54, 2, 7, 8]

const sortAscending = numbers => numbers.sort((a, b) => a - b)
sortAscending(numbers) //?
// bad; the list is mutated
numbers //?

// key: mutate a copy of the input, not the input itself
const sortAscendingPure = numbers => [...numbers].sort((a, b) => a - b)
sortAscendingPure(numbers2) //?
// good; the original array stays the same
numbers2 //?
