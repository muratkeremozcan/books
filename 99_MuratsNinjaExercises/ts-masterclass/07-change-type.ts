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

/////////
interface ICast1 {
  m1: string
}
interface ICast2 {
  m1: string
  m2: string
}
let icast1: ICast1 = {m1: 'm1'}
let icast2: ICast2 = {m1: 'm1', m2: 'm2'}
let icast3: ICast1 = icast2
