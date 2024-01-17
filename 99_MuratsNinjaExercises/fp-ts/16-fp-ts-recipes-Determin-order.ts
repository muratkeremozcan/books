// this kind of import is not tree shakable, but easier to manage when so many examples in 1 file
// the alternative is " import {x as numberX} "
import * as number from 'fp-ts/number'
import * as string from 'fp-ts/string'
import * as boolean from 'fp-ts/boolean'
import * as date from 'fp-ts/Date'
import * as Ord from 'fp-ts/Ord'
import * as A from 'fp-ts/Array'
import {concatAll} from 'fp-ts/Monoid'
import {getOrd, none, some} from 'fp-ts/Option'
// https://grossbart.github.io/fp-ts-recipes/#/ordering

// If you need to decide on the order of two values, you can make use of the compare method provided by Ord instances

// x < y  -1
// x > y   1
// x = y   0

//////////////// Primitive comparisons

number.Ord.compare(4, 5) //?
number.Ord.compare(5, 5) //?
number.Ord.compare(5, 4) //?

boolean.Ord.compare(true, false) //?
date.Ord.compare(new Date('1984-01-27'), new Date('1978-09-23')) //?
string.Ord.compare('A', 'B') //?

//////////////// Custom comparisons

const strLenOrd = Ord.fromCompare((a: string, b: string) =>
  a.length < b.length ? -1 : a.length > b.length ? 1 : 0,
)

strLenOrd.compare('aa', 'a') //?
strLenOrd.compare('a', 'aa') //?

// most of the time you can achieve the same result in a simpler way with contramap

const strLenOrdC = Ord.contramap((s: string) => s.length)(number.Ord)

strLenOrdC.compare('aa', 'a') //?
strLenOrdC.compare('a', 'aa') //?

////////////// Min, max, clamp
// Take the smaller (min) or larger (max) element of two, or take the one closest to the given boundaries (clamp)

Ord.min(number.Ord)(5, 2) //?
Ord.max(number.Ord)(5, 2) //?

Ord.clamp(number.Ord)(5, 2)(10) //?
Ord.clamp(string.Ord)('Bar', 'Boat')('Ball') //?

/////////////// Less than, greater than, or in between

Ord.lt(number.Ord)(5, 2) //?
Ord.gt(number.Ord)(5, 2) //?
Ord.geq(number.Ord)(2, 2) //?
Ord.between(number.Ord)(6, 9)(7) //?
Ord.between(number.Ord)(6, 9)(6) //?
Ord.between(number.Ord)(6, 9)(9) //?
Ord.between(number.Ord)(6, 9)(10) //?

//////////////// Sort an array

const sortByNumber = A.sort(number.Ord)
sortByNumber([4, 2, 1, 3]) //?

// sort an array based on sum
const arrayOfArrays = [
  [3, 2, 1], // 6
  [9, 7, 6, 8], // 30
  [1, 4], // 5
]

const arraySumOrd = Ord.contramap(A.reduce(0, number.SemigroupSum.concat))(number.Ord)

A.sort(arraySumOrd)(arrayOfArrays) //?

// Sort an array of objects
type Planet = {
  name: string
  diameter: number // km
  distance: number // AU from Sun
}

const planets: Array<Planet> = [
  {name: 'Earth', diameter: 12756, distance: 1},
  {name: 'Jupiter', diameter: 142800, distance: 5.203},
  {name: 'Mars', diameter: 6779, distance: 1.524},
  {name: 'Mercury', diameter: 4879.4, distance: 0.39},
  {name: 'Neptune', diameter: 49528, distance: 30.06},
  {name: 'Saturn', diameter: 120660, distance: 9.539},
  {name: 'Uranus', diameter: 51118, distance: 19.18},
  {name: 'Venus', diameter: 12104, distance: 0.723},
  {name: 'Nibiru', diameter: 142400, distance: 409},
  {name: 'Nibira', diameter: 142400, distance: 409},
]

const diameterOrd = Ord.contramap((x: Planet) => x.diameter)(number.Ord)
const distanceOrd = Ord.contramap((x: Planet) => x.distance)(number.Ord)

A.sort(distanceOrd)(planets) //?
A.sort(diameterOrd)(planets) //?

// Sort array with two Ord instances using Semigroup. To combine more than two Ord instances use Monoid.
const nameOrd = Ord.contramap((x: Planet) => x.name)(string.Ord)

const S = Ord.getSemigroup<Planet>()
const M = Ord.getMonoid<Planet>()

const diameterDistanceOrd = S.concat(diameterOrd, distanceOrd) // combine 2 Ord
const diameterDistanceNameOrd = concatAll(M)([diameterOrd, distanceOrd, nameOrd]) // combine 3 Ord

console.log('diameter-distance order', A.sort(diameterDistanceOrd)(planets)) //?
console.log('diameter-distance-name order', A.sort(diameterDistanceNameOrd)(planets)) //?

///////////////// More Ord instances
const O = getOrd(number.Ord)
O.compare(none, none) //?
O.compare(none, some(1)) //?
O.compare(some(1), none) //?
O.compare(some(1), some(2)) //?
O.compare(some(1), some(1)) //?

// It works similarly for Tuples and other types where it is possible to determine order:
const tuple = Ord.tuple(string.Ord, number.Ord)
tuple.compare(['A', 10], ['A', 12]) //?
tuple.compare(['A', 10], ['A', 4]) //?
tuple.compare(['A', 10], ['B', 4]) //?
