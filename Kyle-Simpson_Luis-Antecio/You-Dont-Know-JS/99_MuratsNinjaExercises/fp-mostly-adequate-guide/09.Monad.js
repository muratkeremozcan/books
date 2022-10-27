import {
  prop,
  concat,
  pipe,
  head,
  map,
  path as Rpath,
  curry,
  add,
  chain,
} from 'ramda'
import {Option, Result, AsyncData} from '@swan-io/boxed'
import {Maybe, IO} from '@mostly-adequate/support'
const fs = require('fs').promises

// Pointed functor: a functor with an of method
// drop-in any value into the functor and start mapping away, aka. Lift any value in our type
// Monad: Pointed functor that can flatten

Option.Some(1336).map(add(1)) //?

AsyncData.Done([{id: 2}, {id: 3}]).map(map(prop('id'))) //?
AsyncData.Done([{id: 2}, {id: 3}]).flatMap(map(prop('id'))) //?

Result.Ok('The past, present and future walk into a bar...').flatMap(
  concat('It was tense. '),
) //?

/////
// A nested functor situation where it's neat to see there are three possible failures in our function,
// but it's a little presumptuous to expect a caller to map three times to get at the value

// safeProp :: Key -> {Key: a} -> Maybe a
const safeProp = curry((x, obj) => Option.fromNullable(obj[x]))

// safeHead :: [a] -> Maybe a
const safeHead = safeProp(0)

// firstAddressStreet :: User -> Maybe (Maybe (Maybe Street))
const firstAddressStreet = pipe(
  safeProp('addresses'),
  map(safeHead),
  map(map(safeProp('street'))),
)

// 3 layers of monads
// Maybe(Maybe(Maybe({name: 'Mulburry', number: 8402})))
firstAddressStreet({
  addresses: [{street: {name: 'Mulburry', number: 8402}, postcode: 'WC2N'}],
}) //?

// We don't seem to have an onion problem with ramda functions
const firstAddressStreetR = pipe(
  map(map(prop('street'))),
  map(head),
  prop('addresses'),
)
firstAddressStreetR({
  addresses: [
    {
      street: {name: 'Mulburry', number: 8402, nickname: 'abc'},
      postcode: 'WC2N',
    },
  ],
}) //?

// classic join can handle the nesting
const mmo = Maybe.of(Maybe.of('nunchucks'))
mmo.join() //?
// in swan-io/boxed, we have .value
const mmoO = Option.Some(Option.Some('nunchucks'))
mmoO.value //?

// map + join is flatMap, also called chain in the FP and ramda world
// map/join
// const firstAddressStreet1 = compose(
//   join,
//   map(safeProp('street')),
//   join,
//   map(safeHead),
//   safeProp('addresses'),
// )

// chain
// const firstAddressStreetC = compose(
//   chain(safeProp('street')),
//   chain(safeHead),
//   safeProp('addresses'),
// )

// we don't seem to have an onion problem with ramda functions
// we can get the same output by changing the pipeline order, and have less functions
const firstAddressStreetRC = pipe(prop('addresses'), map(prop('street')), head)

firstAddressStreetRC({
  addresses: [
    {
      street: {name: 'Mulburry', number: 8402, nickname: 'abc'},
      postcode: 'WC2N',
    },
  ],
}) //?

// just keep in mind that chain is flattened version of map with ramda
// prefer to map when returning a "normal" value and chain when we're returning another functor.
const duplicate = n => [n, n]
map(duplicate)([1, 2, 3]) //?
chain(duplicate)([1, 2, 3]) //?

// the equivalent of .chain is .flatMap in swan-io/boxed
Maybe.of(3).map(three => Maybe.of(2).map(add(three))) //?
Maybe.of(3).chain(three => Maybe.of(2).map(add(three))) //?
Maybe.of(3).chain(three => Maybe.of(2).chain(add(three))) //?
Option.Some(3).map(three => Option.Some(2).map(add(three))) //?
Option.Some(3).flatMap(three => Option.Some(2).map(add(three))) //?
Option.Some(3).flatMap(three => Option.Some(2).flatMap(add(three))) //?

Maybe.of(null).chain(prop('address')).chain(prop('street')) //?
Option.fromNullable(null).flatMap(prop('address')).flatMap(prop('street')) //?

//////// exercises

// Use prop and map/join or chain to safely get the street name when given a user
const user = {
  id: 1,
  name: 'Albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
}

const getStreetName = Rpath(['address', 'street'])
const getStreetName2 = pipe(prop('address'), prop('street'))

getStreetName(user) //?
getStreetName(null) //?
getStreetName2(user) //?

Option.fromNullable(user).flatMap(getStreetName) //?

// some terrible solutions
// https://sourcegraph.com/github.com/lin199412/notes-WEB/-/blob/now2_notes/infinite/book%20%20mostly-adequate/mostly-adequate-guide-chinese-master/code/part2_exercises/exercises/monads/monad_exercises.js?L15
