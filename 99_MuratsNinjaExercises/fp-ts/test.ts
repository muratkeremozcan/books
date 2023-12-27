import {Semigroup} from 'fp-ts/Semigroup'
import {SemigroupAll} from 'fp-ts/boolean'

type Point = {
  x: number
  y: number
}

// Semigroup for predicates on Point
const semigroupPredicate: Semigroup<(p: Point) => boolean> = {
  concat: (f, g) => p => SemigroupAll.concat(f(p), g(p)),
}

// Usage example:
const isPositiveX = (p: Point): boolean => p.x > 0
const isPositiveY = (p: Point): boolean => p.y > 0

const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY)

console.log(isPositiveXY({x: 5, y: -3})) // false
console.log(isPositiveXY({x: 5, y: 3})) // true
