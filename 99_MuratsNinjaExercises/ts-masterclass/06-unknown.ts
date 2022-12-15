// The unknown is like any, but it does not allow access to properties

let variable1: any
variable1 = 'It is a string'
console.log(variable1.substr(0, 2)) // Output "it"
variable1 = 1
// console.log(variable1.substr(0, 2)) //  variable1.substr is not a function

let variable2: unknown
variable2 = 'It is a string'
// console.log(variable2.substr(0, 2)) // 'variable2' is of type 'unknown'
variable2 = 1
// console.log(variable2.substr(0, 2)) // 'variable2' is of type 'unknown'

//////////
// with unknown, we can only access properties by type casting or using a type assertion.
let variable3: unknown
variable3 = 'It is a string'
let variable3String = variable3 as string // type casting
console.log(variable3String.substr(0, 2))

// access properties with type assertion
let variable4: unknown
variable4 = 'It is a string'
let variable4String = (<string>variable4).substr(0, 2)
console.log(variable4String)

///// Optional chaining
interface ObjectA {
  m1?: ObjectB
}
interface ObjectB {
  m2?: ObjectC
}
interface ObjectC {
  m3: string
}

// old way
function print(o: ObjectA) {
  if (o.m1) {
    if (o.m1.m2) {
      return o.m1.m2.m3
    }
  }
}

const obj1: ObjectA = {
  m1: undefined,
}
const obj2: ObjectA = {
  m1: {
    m2: undefined,
  },
}
const obj3: ObjectA = {
  m1: {
    m2: {
      m3: 'Yeah!',
    },
  },
}
print(obj1) //?
print(obj2) //?
print(obj3) //?

// new way
function print2(o: ObjectA) {
  return o.m1?.m2?.m3
}
print2(obj1) //?
print2(obj2) //?
print2(obj3) //?

///// nullish coalescing
function getValue(): string | undefined {
  // if (Math.random() > 0.5) {
  //   return undefined
  // }
  // return 'Good'
  return Math.random() > 0.5 ? undefined : 'Good'
}
// randomly returns 'default' or 'Good'

// old way
let value = getValue()
if (!value) {
  value = 'default'
}
value //?

// using the || would be problematic with 0 '' false NaN
const value2 = getValue() || 'default'
value2 //?

// nullish coalescing will can be used instead
const value3 = getValue() ?? 'default'
value3 //?
