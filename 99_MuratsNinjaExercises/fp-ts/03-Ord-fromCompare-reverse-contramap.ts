import {type Ord, fromCompare, contramap, reverse} from 'fp-ts/Ord'
import {number} from 'fp-ts'
// https://dev.to/gcanti/getting-started-with-fp-ts-ord-5f1e

/*
In the previous blog post about Eq we were dealing with the concept of equality. 
In this blog post we are going to deal with the concept of order.

Total Ordering: Ord formalizes and abstracts the concept of total ordering.
This abstraction allows you to write more general and reusable code when dealing with comparison and sorting operations.
Ord represents types that have a total ordering. 
This means for any two values of the type, you can determine whether one is less than, equal to, or greater than the other.
This is crucial for tasks like sorting and comparing.

Extension of Equality: Ord extends the Eq type class, which means any type with an Ord instance also has an Eq instance. 
This provides a unified interface for both equality and ordering.

Composability: Through functions like contramap and reverse, Ord instances can be transformed and composed, 
allowing you to easily create new ordering schemes from existing ones. 
For example, if you have an Ord instance for numbers, you can derive an Ord instance for objects that contain numbers (like User sorted by age).

Generalization of Comparison Functions: Instead of writing specific comparison functions for each type, 
Ord allows you to write generic functions (like min, max, sort) that can operate on any type with an Ord instance. 
This leads to more reusable and maintainable code.

// A type class Ord, intended to contain types that admit a total ordering, is declared in the following way

type Ordering = -1 | 0 | 1

interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering
}
const ordNumber: Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
}
*/

// fp-ts/Ord exports an handy fromCompare helper which allows you to define an Ord instance by specifying a compare function
// const ordNumber: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0))
// Predefined Ord instance for numbers
const ordNumber: Ord<number> = number.Ord
ordNumber.compare(2, 1) //?
ordNumber.compare(1, 2) //?

// A programmer could then define a function min (which takes the minimum of two values) in the following way
const min =
  <A>(O: Ord<A>): ((x: A, y: A) => A) =>
  (x, y) =>
    O.compare(x, y) === 1 ? y : x

min(ordNumber)(2, 1) //?

// what if we want to get max? We can use the reverse combinator
// we use combinators when we want to compose

const max = <A>(O: Ord<A>): ((x: A, y: A) => A) => min(reverse(O))

max(ordNumber)(2, 1) //?

////////////
// complex type example
type User = {
  name: string
  age: number
}

const byAge: Ord<User> = fromCompare((x, y) => (x.age < y.age ? -1 : x.age > y.age ? 1 : 0))

byAge.compare({name: 'Murat', age: 3}, {name: 'Kerem', age: 2}) //?
byAge.compare({name: 'Ozcan', age: 1}, {name: 'Kerem', age: 2}) //?

// We can avoid some boilerplate by using the contramap combinator:
// given an instance of Ord for A and a function from B to A, we can derive an instance of Ord for B
// We already have an instance of Ord for number, which knows to compare two numbers for equality.
// We can use contramap to transform the Ord<number> instance into an Ord<User> instance

const byAgeC: Ord<User> = contramap((user: User) => user.age)(ordNumber)

byAgeC.compare({name: 'Murat', age: 3}, {name: 'Kerem', age: 2}) //?
byAgeC.compare({name: 'Ozcan', age: 1}, {name: 'Kerem', age: 2}) //?

const getYounger = min(byAgeC)

getYounger({name: 'Murat', age: 3}, {name: 'Kerem', age: 2}) //?
getYounger({name: 'Ozcan', age: 1}, {name: 'Kerem', age: 2}) //?

const getOlder = max(byAgeC)

getOlder({name: 'Murat', age: 3}, {name: 'Kerem', age: 2}) //?
getOlder({name: 'Ozcan', age: 1}, {name: 'Kerem', age: 2}) //?
