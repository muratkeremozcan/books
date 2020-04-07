import { map as map_kyle } from './1_map-KEY';
import { filter as filter_kyle } from './2_filter-KEY';
import { reduce as reduce_kyle } from './3_reduce-KEY';
import { composeChainedMethods, partialThis, compose, filter, map, reduce, pipe } from '../fp-tool-belt';
const isOdd = n => n % 2 == 1;
const double = n => n * 2;
const sum = (a, b) => a + b;

// It is a challenge for FPers to combine their utilities (fp-tool-belt) with array prototype


// 1st style (classic)
[1, 2, 3, 4, 5]
  .filter(isOdd)
  .map(double)
  .reduce(sum, 0); //?


// 2nd style (FP preferred)
// Visual order is inner to outer. Awkward.
reduce_kyle(
  map_kyle(
    filter_kyle(
      [1, 2, 3, 4, 5],
      isOdd
    ),
    double
  ),
  sum,
  0
); //?


// 3rd style (FP preferred) vs using this aware, composable FP utilities
composeChainedMethods(
  partialThis(Array.prototype.reduce, sum, 0),
  partialThis(Array.prototype.map, double),
  partialThis(Array.prototype.filter, isOdd)
)([1, 2, 3, 4, 5]); //?


// 4th style (FP preferred) composing standalone utilities
// Note FP libraries typically define filter(..), map(..), and reduce(..) to instead receive the array last, 
// They also typically automatically curry the utilities

compose(
  reduce(sum)(0),
  map(double),
  filter(isOdd)
)([1, 2, 3, 4, 5]); //?

pipe(
  filter(isOdd),
  map(double),
  reduce(sum)(0)
)([1, 2, 3, 4, 5]); //?