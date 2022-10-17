import * as R from 'ramda'
// a array is a FP type; a container that holds any value (string, date, boolean, array, object, etc.)
// the container must have a map method

const Identity = x => ({
  value: x,
  map: fn => Identity(fn(x)),
})

const name = Identity('Bob')
name //?

// how would we change the value of name without mutating it?
const newName = name.map(v => `My name is not ${v}!`).map(v => v.toUpperCase())

newName //?
newName.value //?

/// R.map works on arrays, objects or strings
const arr = [1, 2, 3, 4, 5]
R.map(R.multiply(2), arr) //?

const obj = {a: 1, b: 2, c: 3, d: 4, e: 5}
R.map(R.multiply(2), obj) //?

const str = 'hello'
R.map(R.concat('yay'), str) //?
