import {Monoid, struct, concatAll} from 'fp-ts/Monoid'
import {type Option, getMonoid, some, none, fold} from 'fp-ts/Option'
import {first, last} from 'fp-ts/Semigroup'
// https://dev.to/gcanti/getting-started-with-fp-ts-monoid-ja0

/*
In the last post we saw that a Semigroup captures the concept of "merging" values (via concat). 
A Monoid is any Semigroup that happens to have a special value which is "neutral" with respect to concat.


Monoids are important in functional programming for several reasons:

Identity Element: A Monoid extends a Semigroup by adding an identity element. 
This element acts neutrally when combined with any other element, leaving the other element unchanged. 
For example, 0 is the identity element for addition, and 1 is for multiplication.

Simplification of Code: The presence of an identity element simplifies many operations, 
especially when dealing with lists or sequences of operations. 
It provides a safe starting point for folds or reductions and helps in handling empty cases gracefully.

Generalization and Reusability: Monoids provide a more general and abstract way to combine elements. 
This abstraction allows for writing generic and reusable code for various types of operations, 
like summing a list of numbers, concatenating strings, or combining application states.

Parallelization and Efficiency: The associative property of monoids, inherited from semigroups, 
is beneficial for parallelizing operations and improving efficiency, as it allows breaking down and reordering computations.


import { Semigroup } from 'fp-ts/Semigroup'

interface Monoid<A> extends Semigroup<A> {
  readonly empty: A
}

Whichever side of concat we put the value empty, it must make no difference to the value.
Right identity: concat(x, empty) = x, for all x in A
Left identity: concat(empty, x) = x, for all x in A

*/

// Most of the semigroups we saw in the previous post are actually monoids

/** number `Monoid` under addition */
const monoidSum: Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0,
}

/** number `Monoid` under multiplication */
const monoidProduct: Monoid<number> = {
  concat: (x, y) => x * y,
  empty: 1,
}

const monoidString: Monoid<string> = {
  concat: (x, y) => x + y,
  empty: '',
}

/** boolean monoid under conjunction */
const monoidAll: Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: true,
}

/** boolean monoid under disjunction */
const monoidAny: Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: false,
}

monoidSum.concat(1, 2) //?
monoidProduct.concat(1, 2) //?
monoidString.concat('a', 'b') //?
monoidAll.concat(true, false) //?
monoidAny.concat(true, false) //?

////////// complex example

type Point = {
  x: number
  y: number
}

// we can provide a Monoid instance for each field
const monoidPoint: Monoid<Point> = struct({x: monoidSum, y: monoidSum})

const point1: Point = {x: 1, y: 2}
const point2: Point = {x: 1, y: 2}
const point3: Point = {x: 3, y: 4}

monoidPoint.concat(point1, point3) //?

// We can go on and feed struct with the instance just defined

type Vector = {
  from: Point
  to: Point
}

const monoidVector: Monoid<Vector> = struct({from: monoidPoint, to: monoidPoint})

const vector1: Vector = {from: point1, to: point2}
const vector2: Vector = {from: point1, to: point2}
const vector3: Vector = {from: point1, to: point3}

monoidVector.concat(vector1, vector3) //?

/////// Folding (concatAll in 2.0)
// When using a monoid instead of a semigroup, folding is even simpler:
// we don't need to explicitly provide an initial value (the implementation can use the monoid's empty value for that)

concatAll(monoidSum)([1, 2, 3, 4]) //?
concatAll(monoidProduct)([1, 2, 3, 4]) //?

///////// Monoids for type constructors
// If we can find a monoid instance for A then we can derive a monoid instance for Option<A> (via getMonoid) which works like this
// x	      y		    concat(x, y)
// none	    none	  none
// some(a)	none  	none
// none	    some(a)	none
// some(a)	some(b)	some(concat(a, b))

const M = getMonoid(monoidSum)

M.concat(some(1), none) //?
M.concat(some(1), some(2)) //?
M.concat(some(1), M.empty) //?

// Handling the result safely
const handleResultOption = fold(
  () => null,
  (value: number) => value,
)

handleResultOption(M.concat(some(1), some(2))) //?

// We can derive two other monoids for Option<A> (for all A)
// Monoid returning the left-most non-None value, and the inverse

const getFirstMonoid = getMonoid(first<number>())
const getLastMonoid = getMonoid(last<number>())

getFirstMonoid.concat(some(1), some(2)) //?
getLastMonoid.concat(some(1), some(2)) //?

// As an example, getLastMonoid can be useful for managing optional values

/** VSCode settings */
interface Settings {
  /** Controls the font family */
  fontFamily: Option<string>
  /** Controls the font size in pixels */
  fontSize: Option<number>
  /** Limit the width of the minimap to render at most a certain number of columns. */
  maxColumn: Option<number>
}

const monoidSettings: Monoid<Settings> = struct({
  fontFamily: getMonoid(last<string>()),
  fontSize: getLastMonoid,
  maxColumn: getLastMonoid,
})

const workspaceSettings: Settings = {
  fontFamily: some('Courier'),
  fontSize: none,
  maxColumn: some(80),
}

const userSettings: Settings = {
  fontFamily: some('Fira Code'),
  fontSize: some(12),
  maxColumn: none,
}

/** userSettings overrides workspaceSettings */
const combinedSettings = monoidSettings.concat(workspaceSettings, userSettings)

const foldOptionToString = (option: Option<string>, defaultValue: string) =>
  fold(
    () => defaultValue,
    (a: string) => a,
  )(option)

const foldOptionToNumber = (option: Option<number>, defaultValue: number) =>
  fold(
    () => defaultValue,
    (a: number) => a,
  )(option)

const foldSettings = {
  fontFamily: foldOptionToString(combinedSettings.fontFamily, 'Default Font'),
  fontSize: foldOptionToNumber(combinedSettings.fontSize, -1),
  maxColumn: foldOptionToNumber(combinedSettings.maxColumn, -1),
}
