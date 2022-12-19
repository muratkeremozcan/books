// The main difference between a constant and a Symbol is that the Symbol is unique

const v1 = 'value1'
const v2 = 'value1'
v1 === v2 //?
const y1 = 3
const y2 = 3
y1 === y2 //?

const s1 = Symbol('value1')
const s2 = Symbol('value1')
// s1 === s2 //? // false and errors

const n1 = Symbol(3)
const n2 = Symbol(3)
// n1 === n2 //?  // false and errors

const prop1 = Symbol()

{
  // An object property can be a symbol.
  const obj = {
    [prop1]: 'value1',
  }
  obj[prop1] //?
}
