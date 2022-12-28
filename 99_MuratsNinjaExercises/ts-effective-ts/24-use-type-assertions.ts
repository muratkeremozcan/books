// Sometimes unsafe type assertions are necessary or expedient.
// When you need to use one, hide it inside a function with a correct signature.

{
  declare function shallowEqual(a: any, b: any): boolean
  function cacheLast<T extends Function>(fn: T): T {
    let lastArgs: any[] | null = null
    let lastResult: any
    return function (...args: any[]) {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~
      //          Type '(...args: any[]) => any' is not assignable to type 'T'
      if (!lastArgs || !shallowEqual(lastArgs, args)) {
        lastResult = fn(...args)
        lastArgs = args
      }
      return lastResult
    }
  }

  function cacheLast2<T extends Function>(fn: T): T {
    let lastArgs: any[] | null = null
    let lastResult: any
    return function (...args: any[]) {
      if (!lastArgs || !shallowEqual(lastArgs, args)) {
        lastResult = fn(...args)
        lastArgs = args
      }
      return lastResult
    } as unknown as T // Ok, we are hiding unsafe type assertion inside the function
  }

  // another example
  function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
    for (const [k, aVal] of Object.entries(a)) {
      if (!(k in b) || aVal !== b[k]) {
        // ~~~~ Element implicitly has an 'any' type
        //      because type '{}' has no index signature
        return false
      }
    }
    return Object.keys(a).length === Object.keys(b).length
  }

  function shallowObjectEqual2<T extends object>(a: T, b: T): boolean {
    for (const [k, aVal] of Object.entries(a)) {
      if (!(k in b) || aVal !== (b as any)[k]) {
        // sometimes you need to use unsafe type assertion
        return false
      }
    }
    return Object.keys(a).length === Object.keys(b).length
  }
}
