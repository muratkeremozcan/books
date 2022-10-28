import {concat, toUpper, reverse, compose, curry, add} from 'ramda'
import {Option, Result} from '@swan-io/boxed'
import {Maybe, Either} from '@mostly-adequate/support'

// didn't get much from this https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch10
// or https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch12

// we cannot do this because the numbers are not bottled up
add(Maybe.of(2), Maybe.of(3)) //?
add(Option.Some(2), Option.Some(3)) //?

// An applicative functor is a pointed functor with an ap method
// ap is a function that can apply the function contents of one functor to the value contents of another.

// F.of(x).map(f) === F.of(f).ap(F.of(x));
Maybe.of(2).map(add).ap(Maybe.of(3)) //?
Maybe.of(add(2)).ap(Maybe.of(3)) //?

// Homomorphism: structure is preserved
Either.of(toUpper).ap(Either.of('oreos')) //?
Either.of(toUpper('oreos')) //?

// Interchange: doesn't matter if we choose to lift our function into the left or right side of ap
const v = Maybe.of(reverse)
const x = 'Sparklehorse'

v.ap(Maybe.of(x)) //?
Maybe.of(f => f(x)).ap(v) //?

//// Lift

// lift these pieces into the applicative functor world
const liftA2 = curry((g, f1, f2) => f1.map(g).ap(f2))
const liftA3 = curry((g, f1, f2, f3) => f1.map(g).ap(f2).ap(f3))

const tOfM = compose(Maybe.of, Maybe.of)

liftA2(
  liftA2(concat),
  tOfM('Rainy Days and Mondays'),
  tOfM(' always get me down'),
) //?
// Maybe(Maybe(Rainy Days and Mondays always get me down))

// Transformations
// https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch11

// Write a natural transformation that converts Either b a to Maybe a
// Result -> Option (Either -> Maybe)
Result.Ok(2).toOption() //?
Result.Error('error').toOption() //?

// Option -> Result (Maybe -> Either)  .toResult(errorWhenNone)
Option.Some(2).toResult('not Found') //?
Option.None().toResult('not Found') //?
