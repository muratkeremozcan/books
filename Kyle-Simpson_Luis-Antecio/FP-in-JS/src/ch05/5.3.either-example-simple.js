const Result = require('folktale/result');
import { ifElse } from 'ramda';

const divideByOriginal = (dividend, divisor) => {
  if (divisor === 0) {
    throw new Error('Division by zero');
  } else {
    return dividend / divisor;
  }
};

divideByOriginal(6, 3); //?
// divideByOriginal(6, 0); //?  // breaks all



const divideByFp = (dividend, divisor) => {
  if (divisor === 0) {
    return Result.Error('Division by zero');
  } else {
    return Result.Ok(dividend / divisor);
  }
}

divideByFp(6, 3); //?
divideByFp(6, 0); //?


const divideByR = (dividend, divisor) => ifElse(
  () => divisor === 0,
  () => Result.Error('Division by zero'),
  () => Result.Ok(dividend / divisor)
)();

divideByR(6,3) //?
divideByFp(6, 0); //?

divideByR(6,3).getOrElse(); //?
divideByFp(6, 0).getOrElse(); //?


////

const parseNumber = (input) => isNaN(input) 
  ? Result.Error(`Not a number: ${input}`) 
  : Result.Ok(Number(input));

const parseBool = (input) => 
  input === 'true' ? Result.Ok(true)
  : input === 'false' ? Result.Ok(false)
  : Result.Error(`Not a boolean: ${input}`);

const parseNumberOrBool = input => 
  parseNumber(input)
  .orElse(() => parseBool(input));

parseNumberOrBool('13'); //?

parseNumberOrBool('true'); //?

parseNumberOrBool('foo'); //?


// s with successes' .map, one may also transform the failure value of a Result without changing the context of the computation by using the .mapError method:
const parseNumberOrBool2 = input => 
  parseNumber(input)
  .orElse(() => parseBool(input))
  .mapError(() => `Not a number or boolean: ${input}`);

parseNumberOrBool2('foo'); //?



////

// Pattern matching allows one to specify a piece of code for each case in a structure, like an if/else or switch, but specific to that structure.

Result.Ok(1).matchWith({
  Ok:    ({ value }) => `Ok: ${value}`,
  Error: ({ value }) => `Error: ${value}`
}); //?

Result.Error(1).matchWith({
  Ok:    ({ value }) => `Ok: ${value}`,
  Error: ({ value }) => `Error: ${value}`
}); //?
