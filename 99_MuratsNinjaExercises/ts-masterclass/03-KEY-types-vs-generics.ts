// we can assign (declare or infer) the type of the array
let a: number[]
const arrayOfNumber = [1, 2, 3]
const arrayOfString = ['string', 'array', 'only']

// same: we can also use generics to declare the type of the array
// this syntax isn't used as often as the above, because of JSX
let b: Array<number>
const arrayOfNumber2: Array<number> = [1, 2, 3]
const arrayOfString2: Array<string> = ['string', 'array', 'only']

// declare multiple types
const arrayOfNumberOrString: (number | string)[] = ['string', 'array', 'only', 1, 2, 3]
// same:
const arrayOfNumberOrString2: Array<number | string> = ['string', 'array', 'only', 1, 2, 3]

function printArray(a: number[]) {
  a.push(1)
  return a
}
arrayOfNumber //?
printArray(arrayOfNumber) //?

// same
function printArray2(a: Array<number>) {
  a.push(1)
  return a
}
arrayOfNumber2 //?
printArray2(arrayOfNumber2) //?

//// ReadonlyArray

const arrayOfNumber3: readonly number[] = [1, 2, 3]
// arrayOfNumber3.push(4) //? Error: Property 'push' does not exist on
// same
const arrayOfNumber4: ReadonlyArray<number> = [1, 2, 3]
// arrayOfNumber4.push(1) //? Error: Property 'push' does not exist on type 'readonly number[]'
