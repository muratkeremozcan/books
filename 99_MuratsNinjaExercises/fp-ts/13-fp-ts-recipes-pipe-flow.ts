// https://grossbart.github.io/fp-ts-recipes/#/basics
import {pipe, flow} from 'fp-ts/function'

const add5 = (x: number) => x + 5
const multiply2 = (x: number) => x * 2

// pipe takes a value as its first argument and then threads it through the remaining functions

// nesting is meh
multiply2(add5(3)) //?
// pipe is the way
pipe(3, add5, multiply2) //?
flow(add5, multiply2)(3) //?

// flow is a variation of pipe (the arg is built-in)
const runPipe = (x: number) => pipe(x, add5, multiply2)
const runFlow = flow(add5, multiply2)

runPipe(3) //?
runFlow(3) //?
