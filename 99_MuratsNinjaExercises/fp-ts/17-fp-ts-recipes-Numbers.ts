// https://grossbart.github.io/fp-ts-recipes/#/numbers

import {Bounded, MonoidSum, MonoidProduct} from 'fp-ts/number'
import {concatAll, min, max, struct, tuple} from 'fp-ts/Monoid'
import {getMonoid} from 'fp-ts/function'
import {MonoidAll} from 'fp-ts/boolean'
import {some, none, Applicative} from 'fp-ts/Option'
import {left, right, Applicative as ApplicativeE} from 'fp-ts/Either'
import {getApplicativeMonoid} from 'fp-ts/Applicative'
///////////// min & max

const minVal = concatAll(min(Bounded))
const maxVal = concatAll(max(Bounded))

minVal([1, 2, 3]) //?
maxVal([1, 2, 3]) //?

///////////// sum & product

const sum = concatAll(MonoidSum)
const product = concatAll(MonoidProduct)

sum([1, 2, 3, 4]) //?
product([1, 2, 3, 4]) //?

///////////// nested structures
type Point = {
  x: number
  y: number
}

const point1: Point = {x: 1, y: 2}
const point2: Point = {x: 1, y: 2}
const point3: Point = {x: 3, y: 4}

const monoidPoint = struct({
  x: MonoidSum,
  y: MonoidSum,
})
monoidPoint.concat(point1, point2) //?

const monoidPoints = concatAll(monoidPoint)
monoidPoints([point1, point2, point3]) //?

type PointOrPointT = Point | PointT
const monoidPredicate = getMonoid(MonoidAll)<any>() // to make it work with both Point and PointT

const isPositiveX = (p: Point) => p.x >= 0
const isPositiveY = (p: Point) => p.y >= 0

const isPositiveXY = monoidPredicate.concat(isPositiveX, isPositiveY)

isPositiveXY({x: 1, y: 1}) //?
isPositiveXY({x: 1, y: -1}) //?
isPositiveXY({x: -1, y: 1}) //?
isPositiveXY({x: -1, y: -1}) //?

//////////// tuple

type PointT = [number, number]

const monoidPointT = tuple(MonoidSum, MonoidSum)
monoidPointT.concat([1, 2], [3, 4]) //?

const monoidPointTs = concatAll(monoidPointT)
monoidPointTs([
  [1, 2],
  [3, 4],
  [5, 6],
]) //?

// tuples
const isPositiveXT = (p: PointT) => p[0] >= 0
const isPositiveYT = (p: PointT) => p[1] >= 0

const isPositiveXYT = monoidPredicate.concat(isPositiveXT, isPositiveYT)

isPositiveXYT([1, 1]) //?
isPositiveXYT([1, -1]) //?
isPositiveXYT([-1, 1]) //?
isPositiveXYT([-1, -1]) //?

////////////// Optional values

const sumO = concatAll(getApplicativeMonoid(Applicative)(MonoidSum))
const productO = concatAll(getApplicativeMonoid(Applicative)(MonoidProduct))

sumO([some(2), none, some(4)]) //?
sumO([some(2), some(3), some(4)]) //?

productO([some(2), none, some(4)]) //?
productO([some(2), some(3), some(4)]) //?

// Either

const sumE = concatAll(getApplicativeMonoid(ApplicativeE)(MonoidSum))
const productE = concatAll(getApplicativeMonoid(ApplicativeE)(MonoidProduct))

sumE([right(2), left(3), right(4)]) //?
sumE([right(2), right(3), right(4)]) //?

// <- it's the first left value
productE([right(2), left(3), left(4)]) //?
productE([right(2), right(3), right(4)]) //?
