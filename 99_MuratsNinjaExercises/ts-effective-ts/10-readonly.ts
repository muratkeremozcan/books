// with readonly
// TypeScript checks that the parameter isn’t mutated in the function body.
// Callers are assured that your function doesn’t mutate the parameter.
// Callers may pass your function a readonly array.

// If your function does not modify its parameters then declare them readonly.
/// This makes its contract clearer and prevents inadvertent mutations in its implementation.
// Use readonly to prevent errors with mutation and to find the places in your code where mutations occur.
// For deep readonly, check out DeepReadonly generic in ts-essentials

{
  const a: number[] = [1, 2, 3]
  const b: readonly number[] = a
  const c: number[] = b
  // ~ Type 'readonly number[]' is 'readonly' and cannot be
  //   assigned to the mutable type 'number[]'

  // below we have mutation in the function body, and readonly catches the issue
  function arraySum(arr: readonly number[]) {
    let sum = 0
    let num
    while ((num = arr.pop()) !== undefined) {
      // ~~~ 'pop' does not exist on type 'readonly number[]'
      sum += num
    }
    return sum
  }

  // so don't mutate the array
  function arraySum2(arr: readonly number[]) {
    let sum = 0
    for (let num of arr) {
      sum += num
    }
    return sum
  }

  // another example
  const dates: readonly Date[] = [new Date()]
  dates.push(new Date())
  // ~~~~ Property 'push' does not exist on type 'readonly Date[]'
  dates[0].setFullYear(2037) // OK

  // readonly in index signature prevents writes, allows only reads
  let obj: {readonly [k: string]: number} = {}
  // Or Readonly<{[k: string]: number}
  obj.hi = 45
  //  ~~ Index signature in type ... only permits reading
  obj = {...obj, hi: 12} // OK
  obj = {...obj, bye: 34} // OK
}
