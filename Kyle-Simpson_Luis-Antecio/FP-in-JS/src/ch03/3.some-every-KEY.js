// Suppose you need to validate a list of input values.
// You could think of validating an array of parameters as reducing it to a single Boolean value,
//  indicating whether all parameters are valid.
// Using reduce, however, would be a bit inefficient because you’d have to visit all values in the list.

import _ from "lodash";

const array = [1, 2, 3, 4, 5];
array.some((val) => val > 4); //?
array.find((val) => val > 4); //?
// a bad way to replicate .some
!!array.find((val) => val > 4); //?


const isNotValid = (val) => _.isUndefined(val) || _.isNull(val);
const notAllValid = (args) => args.some(isNotValid);
// const allValid = () => !notAllValid; // alternative

// to demo every as the logical inverse, instead of !notAllValid() ...
const isValid = (val) => !_.isUndefined(val) && !_.isNull(val);
const allValid = (args) => args.every(isValid);

const inValidArray = ["string", 0, false, null, undefined];
const validArray = ["string", 0, false, {}];

notAllValid(inValidArray); //?
notAllValid(validArray); //?

allValid(inValidArray); //?
allValid(validArray); //?
