// https://dev.to/gcanti/introduction-to-property-based-testing-17nk
// https://github.com/dubzzz/fast-check

import {Semigroup} from 'fp-ts/Semigroup'
import * as fc from 'fast-check'
import {Monoid} from 'fp-ts/Monoid'

/*
Testing a Semigroup instance We need three ingredients

a Semigroup<A> instance for the type A
a property that encodes the associativity law
a way to generate random values of type A
*/

// a Semigroup<A> instance for the type A
const S: Semigroup<string> = {
  concat: (x, y) => x + ' ' + y,
}

// a property that encodes the associativity law
// a property is a predicate function that returns a boolean

const associativity = (x: string, y: string, z: string) =>
  S.concat(S.concat(x, y), z) === S.concat(x, S.concat(y, z))

// a way to generate random values of type A
// An Arbitrary<A> is responsible to generate random values of type A.
// We need an Arbitrary<string>, fortunately fast-check provides many built-in arbitraries

const arb: fc.Arbitrary<string> = fc.string()

it('my semigroup instance should be lawful', () => {
  fc.assert(fc.property(arb, arb, arb, associativity))
})

const M: Monoid<string> = {
  ...S,
  empty: '',
}

const rightIdentity = (x: string) => M.concat(x, M.empty) === x

const leftIdentity = (x: string) => M.concat(M.empty, x) === x

it('my monoid instance should be lawful', () => {
  fc.assert(fc.property(arb, rightIdentity))
  fc.assert(fc.property(arb, leftIdentity))
})
