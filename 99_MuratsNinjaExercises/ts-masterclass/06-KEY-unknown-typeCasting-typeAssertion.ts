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
let variable3String = variable3 as string // type assertion
console.log(variable3String.substr(0, 2))

// type casting
let variable4: unknown
variable4 = 'It is a string'
let variable4String = (<string>variable4).substr(0, 2)
console.log(variable4String)

////// changing the type
// The type can be changed by type casting or type assertion
// The former is not recommended because it conflicts with the JSX/TSX format

const unknownType: unknown = '123'
const cast = unknownType as number
const assertion = <number>unknownType

// Double casting / assertion
// If you try to cast to a string directly without using an unknown type,
// TypeScript will warn that there are not sufficient overlaps.
// The TypeScript transpiler gives the solution: casting to unknown.
const str = '123'
const bool = true
// const castFromStr = str as number // error
// const castFromBool = bool as number // error
const castFromStr = str as unknown as number //?
const castFromBool = bool as unknown as number //?

// const assertFromStr = <number>str // error
// const assertFromBool = <number>bool // error
const assertFromStr = <number>(<unknown>str) //?
const assertFromBool = <number>(<unknown>bool) //?
