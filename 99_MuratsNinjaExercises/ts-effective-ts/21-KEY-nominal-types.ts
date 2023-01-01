// Nominal types
// in TS, you can have 2 interfaces that have the same structure but are not the same type, this is called structural typing
// in other languages that's not ok, all interfaces must be unique in their structure
// if we want to replicate this behavior in TS, we can use a trick called Branded types (or nominal types)

// TypeScript uses structural (“duck”) typing, which can sometimes lead to surprising results.
{
  interface Vector2D {
    x: number
    y: number
  }
  function calculateNorm(p: Vector2D) {
    return Math.sqrt(p.x * p.x + p.y * p.y)
  }

  calculateNorm({x: 3, y: 4}) // OK, result is 5
  const vec3D = {x: 3, y: 4, z: 1}
  calculateNorm(vec3D) // OK! result is also 5
}

// If you need nominal typing, consider attaching “brands” to your values to distinguish them.
type UserId = string & {__brand: 'UserId'}
type ArticleId = string & {__brand: 'ArticleId'}

declare const userId: UserId

function getArticle(articleId: ArticleId) {}

// getArticle(userId); // 🔴 Error!

// We can generalize nominal types with a generic type
type Nominal<T, K extends string> = T & {__brand: K}

type UserId2 = Nominal<string, 'UserId'>
type ArticleId2 = Nominal<string, 'ArticleId'>

{
  interface Vector2D {
    _brand: '2d'
    x: number
    y: number
  }
  // we can also use nominal types, but that can't be an interface
  type TVector2D = Nominal<{x: number; y: number}, '2d'>

  function vec2D(x: number, y: number): Vector2D {
    return {x, y, _brand: '2d'}
  }
  function calculateNorm(p: Vector2D) {
    return Math.sqrt(p.x * p.x + p.y * p.y) // Same as before
  }

  calculateNorm(vec2D(3, 4)) // OK, returns 5
  const vec3D = {x: 3, y: 4, z: 1}
  calculateNorm(vec3D)
  // ~~~~~ Property '_brand' is missing in type...
}

// In some cases you may be able to attach brands entirely in the type system, rather than at runtime.
// You can use this technique to model properties outside of TypeScript’s type system.

// absolute path example
{
  // type AbsolutePath = string & {_brand: 'abs'}
  type AbsolutePath = Nominal<string, 'abs'>
  function listAbsolutePath(path: AbsolutePath) {
    // ...
  }
  function isAbsolutePath(path: string): path is AbsolutePath {
    return path.startsWith('/')
  }
  function f(path: string) {
    if (isAbsolutePath(path)) {
      listAbsolutePath(path)
    }
    listAbsolutePath(path)
    // ~~~~ Argument of type 'string' is not assignable
    //      to parameter of type 'AbsolutePath'
  }
}

{
  // sorted list example

  // type SortedList<T> = T[] & {_brand: 'sorted'}
  type SortedList<T> = Nominal<T[], 'sorted'>

  function isSorted<T>(xs: T[]): xs is SortedList<T> {
    for (let i = 1; i < xs.length; i++) {
      if (xs[i] > xs[i - 1]) {
        return false
      }
    }
    return true
  }

  // binary search example (with the type, we force it to be passed in a sorted list)
  function binarySearch<T>(xs: SortedList<T>, x: T): boolean {
    let low = 0,
      high = xs.length - 1
    while (high >= low) {
      const mid = low + Math.floor((high - low) / 2)
      const v = xs[mid]
      if (v === x) return true
      ;[low, high] = x > v ? [mid + 1, high] : [low, mid - 1]
    }
    return false
  }
}

// branding units, we can create our own types
{
  // type Meters = number & {_brand: 'meters'}
  type Meters = Nominal<number, 'meters'>

  // type Seconds = number & {_brand: 'seconds'}
  type Seconds = Nominal<number, 'seconds'>

  const meters = (m: number) => m as Meters
  const seconds = (s: number) => s as Seconds

  const oneKm = meters(1000) // Type is Meters
  const oneMin = seconds(60) // Type is Seconds
}
