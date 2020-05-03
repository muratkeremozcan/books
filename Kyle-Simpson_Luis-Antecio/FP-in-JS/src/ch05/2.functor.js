const R = require('ramda');
const wrap = require('../../model/Wrapper.js').wrap;

// in essence, map, filter, reduce, compose are functors. They are type-preserving which is what enables the chaining pattern.
// Functors have 2 requirements: side effect free & composable.
// As a result, they’re prohibited from throwing exceptions, mutating elements, or altering a function’s behavior.

// Functor simple example

const plus = R.curry((a, b) => a + b);
const plus3 = plus(3);
plus3(2); //?

// store number 2 in a wrapper/container/context
const two = wrap(2);

// take the wrapped container/context/value, apply plus3 function to it, create & return a new wrapped context
const five = two.fmap(plus3); //?
// take the new wrapped container/context/value, apply identity function to it to extract its value
five.map(R.identity); //? 


// fmaps can be chained, because it wraps the result again into a new container of the same type

two.fmap(plus3)
  .fmap(R.tap(console.log)); //?

two.fmap(plus3)
  .fmap(R.tap(console.log))
  .map(R.identity); //?


two.fmap(
  R.compose(
    R.tap(console.log),
    plus3
  )
).map(R.identity); //?
