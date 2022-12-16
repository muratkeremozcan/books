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


/**
 * @see https://jira.foo/123
 */
function outputMessage(message: string) {
  if (typeof message === 'string') {
    console.log(message)
  } else {
    let invalid = message
    console.error(invalid)
  }
}