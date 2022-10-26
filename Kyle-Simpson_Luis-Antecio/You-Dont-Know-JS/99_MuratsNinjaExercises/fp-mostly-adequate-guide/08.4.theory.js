import {map, identity, append, compose, pipe, reverse, toUpper} from 'ramda'
import {Option, Result} from '@swan-io/boxed'

// identity
// map(id) === id;

const idLaw1 = map(identity)
const idLaw2 = identity

idLaw1(Option.Some(2)) //?
idLaw2(Option.Some(2)) //?

// composition
// compose(map(f), map(g)) === map(compose(f, g))

const compLaw1 = compose(map(append(' world')), map(append(' cruel')))
const compLaw2 = map(compose(append(' world'), append(' cruel')))

compLaw1(Option.Some('hello')) //?
compLaw2(Option.Some('hello')) //?

/////
// f -> F.of
const topRoute = pipe(reverse, Option.Some)
// F.of -> map(f)
const bottomRoute = pipe(Option.Some, map(reverse))
// are the same (
topRoute('hi') //?
bottomRoute('hi') //?

// Functors can stack
const nested = Option.Some([
  Result.Ok('pillows'),
  Result.Error('no sleep for you'),
])
map(map(map(toUpper)), nested) //?
