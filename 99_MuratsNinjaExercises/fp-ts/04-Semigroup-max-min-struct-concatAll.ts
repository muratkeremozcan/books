// https://dev.to/gcanti/getting-started-with-fp-ts-semigroup-2mf7

import {number} from 'fp-ts'
import type {Ord} from 'fp-ts/Ord'
import {max, min, struct, type Semigroup, concatAll} from 'fp-ts/Semigroup'
import {SemigroupAll} from 'fp-ts/boolean'
import {getApplySemigroup, some, none, fold} from 'fp-ts/Option'

/*
A semigroup is a pair (A, *) in which A is a non-empty set and * is a binary associative operation on A, 
i.e. a function that takes two elements of A as input and returns an element of A as output.

(number, *) where * is the usual multiplication of numbers
(string, +) where + is the usual concatenation of strings
(boolean, &&) where && is the usual conjunction

in fp-ts the type class Semigroup, contained in the fp-ts/Semigroup module, 
is implemented as a TypeScript interface, where the operation * is named concat

interface Semigroup<A> {
  concat: (x: A, y: A) => A
}

The following law must hold
Associativity: concat(concat(x, y), z) = concat(x, concat(y, z)), for all x, y, z in A

Significance of Semigroup
Formal Structure for Combination: A Semigroup provides a formal structure for combining elements of the same type in an associative manner. 
This is particularly useful in scenarios where you have multiple values that need to be combined into a single value, 
like summing numbers, concatenating strings, or merging data structures.

Associativity: The key property of a Semigroup is associativity, which guarantees that the order in which operations are performed does not affect the final result.
 This property is crucial for parallelization and distributed computing, as it allows operations to be restructured without changing the outcome.

Building Block in Algebraic Structures: Semigroups are foundational in algebraic structures in functional programming. 
They form the basis for more complex structures like Monoids, which extend Semigroups with an identity element.

Generalizing Operations: Semigroups help in abstracting and generalizing operations. Instead of writing specific logic for each type of operation, 
you can define a general pattern of 'combination' and reuse it.

*/

/** number `Semigroup` under multiplication */
// const semigroupProduct: Semigroup<number> = {
//   concat: (x, y) => x * y,
// }

/** number `Semigroup` under addition */
// const semigroupSum: Semigroup<number> = {
//   concat: (x, y) => x + y,
// }

// in v2.0 Use SemigroupSum and SemigroupProduct from 'fp-ts/number'
const SemigroupSum: Semigroup<number> = number.SemigroupSum
const SemigroupProduct: Semigroup<number> = number.SemigroupProduct

SemigroupSum.concat(1, 2) //?
SemigroupProduct.concat(1, 2) //?

/** string Semigroup under addition */
const semigroupString: Semigroup<string> = {
  concat: (x, y) => x + y,
}

semigroupString.concat('a', 'b') //?

// What if, given a type A, you can't find an associative operation on A?
// You can create a (trivial) semigroup instance for every type just using the following constructions

/** Always return the first argument */
const getFirstSemigroup = <A = never>(): Semigroup<A> => ({
  concat: (x, y) => x,
})

const firstSemigroup = getFirstSemigroup<number>()
firstSemigroup.concat(1, 2) //?

/** Always return the second argument */
const getLastSemigroup = <A = never>(): Semigroup<A> => ({concat: (x, y) => y})

const lastSemigroup = getLastSemigroup<number>()
lastSemigroup.concat(1, 2) //?

// Another technique is to define a semigroup instance for Array<A> (*), called the free semigroup of A.
const getArraySemigroup = <A = never>(): Semigroup<Array<A>> => ({concat: (x, y) => x.concat(y)})

// and map the elements of A to the singleton elements of Array<A>
const of = <A>(a: A): Array<A> => [a]

const arraySemigroup = getArraySemigroup<number>()
arraySemigroup.concat([1, 2], [3, 4]) //?
arraySemigroup.concat(of(1), of(2)) //?

//////////// Deriving from Ord
// There's another way to build a semigroup instance for a type A:
// if we already have an Ord instance for A, then we can "turn it" into a semigroup.

// Predefined Ord instance for numbers
const ordNumber: Ord<number> = number.Ord

/** Takes the minimum of two values */
const semigroupMin: Semigroup<number> = min(ordNumber)

/** Takes the maximum of two values  */
const semigroupMax: Semigroup<number> = max(ordNumber)

semigroupMin.concat(2, 1) //?
semigroupMax.concat(2, 1) //?

///////////// complex type example
type Point = {
  x: number
  y: number
}

const semigroupPointBoilerP: Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: SemigroupSum.concat(p1.x, p2.x),
    y: SemigroupSum.concat(p1.y, p2.y),
  }),
}

// fp-ts/Semigroup module exports a struct combinator:
const semigroupPoint: Semigroup<Point> = struct({x: SemigroupSum, y: SemigroupSum})

// usage
const point1: Point = {x: 1, y: 2}
const point2: Point = {x: 1, y: 2}
const point3: Point = {x: 3, y: 4}

semigroupPoint.concat(point1, point3) //?

// We can go on and feed struct with the instance just defined

type Vector = {
  from: Point
  to: Point
}

const semigroupVector: Semigroup<Vector> = struct({from: semigroupPoint, to: semigroupPoint})

const vector1: Vector = {from: point1, to: point2}
const vector2: Vector = {from: point1, to: point2}
const vector3: Vector = {from: point1, to: point3}

semigroupVector.concat(vector1, vector3) //?

// struct is not the only combinator provided by fp-ts,
// here's a combinator that allows to derive a Semigroup instance for functions:
// given an instance of Semigroup for S we can derive an instance of Semigroup for functions with signature (a: A) => S, for all A

// Semigroup for predicates on Point
const semigroupPredicate: Semigroup<(p: Point) => boolean> = {
  concat: (f, g) => p => SemigroupAll.concat(f(p), g(p)),
}

// Usage example:
const isPositiveX = (p: Point): boolean => p.x > 0
const isPositiveY = (p: Point): boolean => p.y > 0
const somePoint = {x: 1, y: -2}
isPositiveX(somePoint) //?
isPositiveY(somePoint) //?
semigroupPredicate.concat(isPositiveX, isPositiveY)(somePoint) //?

/////// Folding (concatAll in 2.0)
// concat works with only two elements of A, what if we want to concat more elements?
// the fold function takes a semigroup instance, an initial value and an array of elements:

// Create functions for sum and product
const sum = concatAll(SemigroupSum)(0)
const product = concatAll(SemigroupProduct)(1)

sum([1, 2, 3, 4]) //?
product([1, 2, 3, 4]) //?

///////// Semigroups for type constructors
// What if we want to "merge" two Option<A>? There are four cases,
// and there's a problem with the last one, we'd need something to "merge" two As.
// x	      y		    concat(x, y)
// none	    none	  none
// some(a)	none  	none
// none	    some(a)	none
// some(a)	some(b)	?

// That's what Semigroup does! We can require a semigroup instance for A
// and then derive a semigroup instance for Option<A>.
// This is how the getApplySemigroup combinator works

const S = getApplySemigroup(SemigroupSum)
S.concat(some(1), none) //?
S.concat(some(1), some(2)) //?

// Handling the result safely
const handleResultOption = fold(
  () => null,
  (value: number) => value,
)

handleResultOption(S.concat(some(1), some(2))) //?
