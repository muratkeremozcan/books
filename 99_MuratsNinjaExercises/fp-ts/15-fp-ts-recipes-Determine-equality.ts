import {boolean, date, number, string, array} from 'fp-ts'
import {Eq, struct, contramap} from 'fp-ts/Eq'
import {getEq} from 'fp-ts/Array'
import {getEq as getEqOption, some, none} from 'fp-ts/Option'
import {getEq as getEqEither, right, left} from 'fp-ts/Either'
// https://grossbart.github.io/fp-ts-recipes/#/equality

// With fp-ts you can test whether two values are equal using a Eq

//////////// Primitive equality
boolean.Eq.equals(true, true) //?
date.Eq.equals(new Date('1984-01-27'), new Date('1984-01-27')) //?
number.Eq.equals(3, 3) //?
string.Eq.equals('Cyndi', 'Cindy') //?

//////////// Compare structures
type Point = {
  x: number
  y: number
}

const eqPoint: Eq<Point> = struct({
  x: number.Eq,
  y: number.Eq,
})

const point1: Point = {x: 1, y: 2}
const point2: Point = {x: 1, y: 2}
const point3: Point = {x: 3, y: 4}

eqPoint.equals(point1, point2) //?
eqPoint.equals(point1, point3) //?

type Vector = {
  from: Point
  to: Point
}

const eqVector: Eq<Vector> = struct({
  from: eqPoint,
  to: eqPoint,
})

const vector1: Vector = {from: point1, to: point2}
const vector2: Vector = {from: point1, to: point2}
const vector3: Vector = {from: point1, to: point3}

eqVector.equals(vector1, vector2) //?
eqVector.equals(vector1, vector3) //?

///////////// Compare arrays

const eqArrayOfStrings = getEq(string.Eq)
eqArrayOfStrings.equals(['Time', 'After', 'Time'], ['Time', 'After', 'Time'])

const eqArrayOfPoints: Eq<Point[]> = getEq(eqPoint)
eqArrayOfPoints.equals([point1, point2], [point2, point1]) //?
eqArrayOfPoints.equals([point1, point2], [point2, point3]) //?

/////////// Custom equality
type User = {
  userId: number
  name: string
}

/** two users are equal if their `userId` field is equal */
const eqUser: Eq<User> = contramap((user: User) => user.userId)(number.Eq)

eqUser.equals({userId: 1, name: 'Murat'}, {userId: 1, name: 'Murat Ozcan'}) //?
eqUser.equals({userId: 1, name: 'Murat'}, {userId: 2, name: 'Murat'}) //?

//////////// More Eq instances

const EOption = getEqOption(number.Eq)
EOption.equals(some(3), some(3)) //?
EOption.equals(some(3), none) //?
EOption.equals(none, none) //?

const EEither = getEqEither(string.Eq, number.Eq)
EEither.equals(right(3), right(3)) //?
EEither.equals(left('3'), right(3)) //?
EEither.equals(left('3'), left('3')) //?
