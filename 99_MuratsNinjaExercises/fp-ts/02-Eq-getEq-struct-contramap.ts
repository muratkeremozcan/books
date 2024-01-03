import {struct, contramap, type Eq} from 'fp-ts/Eq'
import {getEq} from 'fp-ts/Array'
// https://dev.to/gcanti/getting-started-with-fp-ts-setoid-39f3

/*
Type classes, like the Eq type class in fp-ts, are significant in functional programming 
because they provide a way to define generic operations that can work with any type that implements the type class. 

A type class Eq, intended to contain types that admit equality, is declared in the following way
// returns `true` if `x` is equal to `y` 
interface Eq<A> {
  readonly equals: (x: A, y: A) => boolean
}
*/

// In fp-ts instances are encoded as static dictionaries.
const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
}

// A programmer could then define a function elem (which determines if an element is in an array) in the following way
const elem =
  <A>(E: Eq<A>): ((a: A, arr: Array<A>) => boolean) =>
  (a, arr) =>
    arr.some(item => E.equals(item, a))

// usage:
elem(eqNumber)(1, [1, 2, 3]) //?
elem(eqNumber)(4, [1, 2, 3]) //?

// comparison to traditional approach:
// when working with primitive types, no need for the above
const elemAlt = <T>(a: T, arr: Array<T>): boolean => arr.some(item => item === a)
elemAlt(1, [1, 2, 3]) //?

////////////////////////
// Eq instances for more complex types

type Point = {
  x: number
  y: number
}

// const eqpPoint: Eq<Point> = {
//   equals: (p1, p2) => (p1.x === p2.x && p1.y === p2.y),
// }

// we can build an Eq instance for a structure like Point
// if we can provide an Eq instance for each field.
// fp-ts/Eq module exports a struct combinator
// we use combinators when we want to compose

const eqPoint: Eq<Point> = struct({
  x: eqNumber,
  y: eqNumber,
})

// usage
const point1: Point = {x: 1, y: 2}
const point2: Point = {x: 1, y: 2}
const point3: Point = {x: 3, y: 4}

eqPoint.equals(point1, point2) //?
eqPoint.equals(point1, point3) //?

// comparison to traditional approach:
class ComparablePoint {
  constructor(public point: Point) {}

  equals(other: ComparablePoint): boolean {
    return this.point.x === other.point.x && this.point.y === other.point.y
  }
}

const point4 = new ComparablePoint({x: 1, y: 2})
const point5 = new ComparablePoint({x: 1, y: 2})
const point6 = new ComparablePoint({x: 3, y: 4})

point4.equals(point5) //?
point4.equals(point6) //?

/*
Comparison with fp-ts Approach
Verbosity: The traditional approach requires defining a new class (ComparablePoint) and explicitly implementing the equals method. 
In contrast, fp-ts allows you to create an Eq instance for Point directly using the struct combinator, which is less verbose and more declarative.

Composability: With fp-ts, you can easily compose Eq instances for complex types from Eq instances of their fields. 
This composability is a core benefit of fp-ts and functional programming in general.

Reusability: The fp-ts approach promotes reusability. Once you define an Eq instance for a type, you can use it throughout your application. 
In the traditional approach, you need to ensure that the equals method is implemented wherever needed, which can lead to duplicated code.

Flexibility: fp-ts provides a consistent way to define equality across different types. If you need to change the equality logic, 
you only need to change it in one place (the Eq instance), and it will be consistently applied everywhere that instance is used.
*/

//////// example 2

// We can go on and feed struct with the instance just defined
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

// comparison to traditional approach:
class ComparableVector {
  constructor(public vector: Vector) {}

  equals(other: ComparableVector): boolean {
    return (
      new ComparablePoint(this.vector.from).equals(new ComparablePoint(other.vector.from)) &&
      new ComparablePoint(this.vector.to).equals(new ComparablePoint(other.vector.to))
    )
  }
}

const cVector1 = new ComparableVector({from: point1, to: point2})
const cVector2 = new ComparableVector({from: point1, to: point2})
const cVector3 = new ComparableVector({from: point1, to: point3})

cVector1.equals(cVector2) //?
cVector1.equals(cVector3) //?

/*
Comparison with fp-ts Approach
Complexity: In the traditional approach, we need to explicitly handle the comparison logic for each component of the Vector.
With fp-ts, we can compose the equality of a complex type (Vector) from its simpler components (Point) easily using the struct combinator.

Boilerplate Code: The traditional approach requires more boilerplate code, as you need to define classes and methods for each type. 
In contrast, fp-ts provides a more concise and declarative way to define equality.

Maintainability: The fp-ts approach can be more maintainable, especially when dealing with many complex types. 
Changes in equality logic for a type (like Point) automatically propagate to all types that compose it (like Vector).
*/

////////
// getEq combinator allows to derive an Eq instance for arrays

const eqArrayOfPoints: Eq<Point[]> = getEq(eqPoint)

eqArrayOfPoints.equals([point1, point2], [point2, point1]) //?
eqArrayOfPoints.equals([point1, point2], [point2, point3]) //?

// the alternative is verbose
function arraysEqual<T>(a: Array<T>, b: Array<T>, compare: (x: T, y: T) => boolean): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!compare(a[i], b[i])) return false
  }
  return true
}

// Usage
arraysEqual([point1, point2], [point2, point1], (p1, p2) =>
  new ComparablePoint(p1).equals(new ComparablePoint(p2)),
) //?
arraysEqual([point1, point2], [point2, point3], (p1, p2) =>
  new ComparablePoint(p1).equals(new ComparablePoint(p2)),
) //?

////////
// contramap combinator:
/*
contramap is a function that allows you to transform the input of a given function or type class instance. 
It's often used in functional programming to create a new function or type class instance based on an existing one, 
but with a transformation applied to its input.

How contramap Works with Eq, in the context of Eq in fp-ts:
Starting Point: You already have an Eq instance for a certain type, say number. 
This instance knows how to compare two numbers for equality.

Transformation Goal: Now, suppose you want to compare objects of a different type, say User,
 based on a specific property (like userId which is a number).

Using contramap: You can use contramap to transform the Eq<number> instance into an Eq<User> instance. 
You provide a function that transforms (or extracts) a number (the userId) from a User object. 
contramap then uses this function to transform each User object into a number 
before applying the original Eq<number> comparison logic.
*/

type User = {
  userId: number
  name: string
}

/** two users are equal if their `userId` field is equal */
const eqUser: Eq<User> = contramap((user: User) => user.userId)(eqNumber)

eqUser.equals({userId: 1, name: 'Murat'}, {userId: 1, name: 'Murat Ozcan'}) //?
eqUser.equals({userId: 1, name: 'Murat'}, {userId: 2, name: 'Murat'}) //?

// comparison with traditional approach:
class ComparableUser {
  constructor(public user: User) {}

  equals(other: ComparableUser): boolean {
    return this.user.userId === other.user.userId
  }
}

const user1 = new ComparableUser({userId: 1, name: 'Murat'})
const user2 = new ComparableUser({userId: 1, name: 'Murat Ozcan'})
const user3 = new ComparableUser({userId: 2, name: 'Murat'})

user1.equals(user2) //?
user1.equals(user3) //?

/*
Verbosity and Boilerplate: The traditional approach requires more boilerplate code for defining comparison logic, 
especially when dealing with arrays. fp-ts simplifies this by providing built-in combinators like getEq.

Composability and Reusability: fp-ts excels in composability. For instance, once you define eqPoint, 
you can easily create an Eq instance for arrays of points without writing new comparison logic. 
The traditional approach lacks this level of composability and requires manual comparison logic.

Flexibility in Equality Logic: fp-ts's contramap allows you to derive new Eq instances 
by transforming a type to another type for which an Eq instance already exists. 
This is particularly useful for types like User where equality might be based on a subset of the object's properties.
*/
