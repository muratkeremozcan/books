// think of types as sets (doesn't make sense to me)
// and the extends keyword as "is a subset of" (ok, makes sense)
// & represents the intersection of two sets (I think of this as add/expand/combine)
// | represents the union of two sets (I think of this as "or")

// TL & DR:
// & means EXPAND
// | means boolean OR

{
  // The smallest set is the empty set, which contains no values. It corresponds to the never type in TypeScript.
  // Because its domain is empty, no values are assignable to a variable with a never type:
  const x: never = 12
  // ~ Type '12' is not assignable to type 'never'

  // The next smallest sets are those which contain single values. These correspond to literal types in TypeScript, also known as unit types:
  type A = 'A'
  type B = 'B'
  type Twelve = 12

  // The word “assignable” appears in many TypeScript errors.
  // In the context of sets of values, it means either “member of” (for a relationship between a value and a type) or “subset of” (for a relationship between two types):
  type AB = 'A' | 'B'
  const a: AB = 'A' // OK, value 'A' is a member of the set {'A', 'B'}

  // Union types correspond to unions of sets of values.
  // To form types with two or three values, you can union unit types:
  type AB12 = 'A' | 'B' | 12
  const c: AB = 'C'
  // ~ Type '"C"' is not assignable to type 'AB' The type "C" is a unit type.
  // Its domain consists of the single value "C". This is not a subset of the domain of AB (which consists of the values "A" and "B"), so this is an error.

  // At the end of the day, almost all the type checker is doing is testing whether one set is a subset of another
  const ab: AB = Math.random() < 0.5 ? 'A' : 'B' // OK, {"A", "B"} is a subset of {"A", "B"}:
  const ab12: AB12 = ab // OK, {"A", "B"} is a subset of {"A", "B", 12}

  let twelve: AB12
  const back: AB = twelve
  // ~~~~ Type 'AB12' is not assignable to type 'AB'
  //        Type '12' is not assignable to type 'AB'
}

{
  interface Person {
    name: string
  }
  interface Lifespan {
    birth: Date
    death?: Date
  }
  type PersonSpan = Person & Lifespan
  // The & operator computes the intersection of two types. What sorts of values belong to the PersonSpan type?
  // On first glance the Person and Lifespan interfaces have no properties in common, so you might expect it to be the empty set (i.e., the never type).
  // But type operations apply to the sets of values (the domain of the type), not to the properties in the interface.
  // And remember that values with additional properties still belong to a type.
  // So a value that has the properties of both Person and Lifespan will belong to the intersection type:
  const ps: PersonSpan = {
    name: 'Alan Turing',
    birth: new Date('1912/06/23'),
    death: new Date('1954/06/07'),
  } // OK

  // The keyof type operator allows you to get the keys of an object type as a union of string literals.
  // It can be used in combination with the union (|) and intersection (&) types to perform set operations on the keys of object types.
  type personKey = keyof Person
  let p: personKey // "name"
  type lifespanKey = keyof Lifespan
  let l: lifespanKey // "birth" | "death"

  // I still don't understand this, keyof operator combined with & and | makes it a shit show
  // otherwise | being OR operator, & being COMBINE operator makes sense everywhere else

  // Here's how the set operations work:
  // keyof (A | B) gets the keys of the union of object types A and B.
  // This is the intersection of the keys of A and B, meaning it gets only the keys that are present in both A and B.

  // keyof (A & B) gets the keys of the intersection of object types A and B. ( to me this means add/expand/combine )
  // This is the union of the keys of A and B, meaning it gets all the keys that are present in either A or B.

  // keyof (A|B) = (keyof A) & (keyof B)
  // keyof (A&B) = (keyof A) | (keyof B)
  type K = keyof (Person | Lifespan) // Type is never, There are no keys that TypeScript can guarantee belong to a value in the union type,
  type K2 = keyof (Person & Lifespan) // Type is "name" | keyof Lifespan (which is "birth" | "death")
  let a: K // never
  let b: K2 // "name" | keyof Lifespan
}

// another way to combine types
{
  interface Person {
    name: string
  }
  interface PersonSpan extends Person {
    birth: Date
    death?: Date
  }
}

// the below are the same
{
  interface Vector1D {
    x: number
  }
  interface Vector2D extends Vector1D {
    y: number
  }
  interface Vector3D extends Vector2D {
    z: number
  }
}
{
  interface Vector1D {
    x: number
  }
  interface Vector2D {
    x: number
    y: number
  }
  interface Vector3D {
    x: number
    y: number
    z: number
  }
}

// extends : is a subset of
{
  function getKey<K extends string>(val: object, key: K) {}

  getKey({}, 'x') // OK, 'x' extends string
  getKey({}, Math.random() < 0.5 ? 'a' : 'b') // OK, 'a'|'b' extends string
  getKey({}, document.title) // OK, string extends string
  getKey({}, 12)
  // ~~ Type '12' is not assignable to parameter of type 'string'
}

// sort by object keys
{
  interface Point {
    x: number
    y: number
  }
  type PointKeys = keyof Point // Type is "x" | "y"

  function sortBy<T, K extends keyof T>(vals: T[], key: K): T[] {
    vals.sort((a: T, b: T) => (a[key] === b[key] ? 0 : a[key] < b[key] ? -1 : +1))
    return vals
  }
  const pts: Point[] = [
    {x: 1, y: 1},
    {x: 2, y: 0},
  ]
  // OK, 'x' extends 'x'|'y' (aka keyof T)
  sortBy(pts, 'x') //?

  // OK, 'y' extends 'x'|'y'
  sortBy(pts, 'y') //?

  // OK, 'x' extends 'x'|'y'
  sortBy(pts, Math.random() < 0.5 ? 'x' : 'y') //?
  sortBy(pts, 'z') // ~~~ Type '"z"' is not assignable to parameter of type '"x" | "y"
}
