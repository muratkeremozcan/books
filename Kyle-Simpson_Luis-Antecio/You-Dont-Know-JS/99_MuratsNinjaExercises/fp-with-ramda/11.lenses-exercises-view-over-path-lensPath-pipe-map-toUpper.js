import * as R from 'ramda'
import employees from './employees-big.json'

// get a list of the favorite flavors

const getPath = R.path([
  'interests',
  'foods',
  'sweets',
  'iceCream',
  'favoriteFlavor',
])

const getLensPath = R.lensPath([
  'interests',
  'foods',
  'sweets',
  'iceCream',
  'favoriteFlavor',
])

// viewing the entire list vs 1 array item
getPath(employees[0]) //?
R.view(getLensPath, employees[0]) //?
R.view(getLensPath)(employees[0]) //?

// When lenses receive the data, they begin unfolding and traverse the data structure.
// Adding map on top of that just loops through employees and feeds each one to view as data.

const faveFlavorList = employees => employees.map(e => R.view(getLensPath)(e))
const faveFlavorListR = R.map(R.view(getLensPath)) //?

faveFlavorList(employees) //?
faveFlavorListR(employees) //?

// capitalize the flavors, append "IS A GREAT FLAVOR" to each one, return them

// const toUpperCase = str => str.toUpperCase()
const toUpperCase = R.toUpper
const emphasizeFlavor = flavor => `${flavor} IS A GREAT FLAVOR`
const toUpperCaseAndEmphasize = R.pipe(toUpperCase, emphasizeFlavor)
const changeFlavor = R.over(getLensPath, toUpperCaseAndEmphasize)
// changeFlavor(employees[0]) //?
const result = R.map(changeFlavor) //?

result(employees) //?
