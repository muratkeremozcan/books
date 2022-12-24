// think of types as sets, and the extends keyword as "is a subset of"
// & represents the intersection of two sets (I think of this as "add" or "expand")
// | represents the union of two sets (I think of this as "or")

{
  type AB = 'A' | 'B'
  type AB12 = 'A' | 'B' | 12

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

  const ps: PersonSpan = {
    name: 'Alan Turing',
    birth: new Date('1912/06/23'),
    death: new Date('1954/06/07'),
  } // OK

  // keyof (A|B) = (keyof A) & (keyof B)
  // keyof (A&B) = (keyof A) | (keyof B)

  type K = keyof (Person | Lifespan) // Type is never
  type K2 = keyof (Person & Lifespan) // Type is "name" | keyof Lifespan

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
