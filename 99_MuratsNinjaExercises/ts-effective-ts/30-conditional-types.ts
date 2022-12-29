// Prefer conditional types to overloaded type declarations.
// conditional types allow your declarations to support union types without additional overloads.

{
  function double(x: number): number
  function double(x: string): string
  function double(x: any) {
    return x + x
  }

  const num = double(12) // Type is 12
  const str = double('x') // Type is "x"
  num //?
  str //?

  function f(x: number | string) {
    return double(x)
    // ~ Argument of type 'string | number' is not assignable
    //   to parameter of type 'string'
  }

  f(12)
  f('x')
}

// the best solution here is to use a conditional type
// Conditional types are like if statements (conditionals) in type space.
// They’re perfect for situations like this one where there are a few possibilities that you need to cover:
{
  function double<T extends number | string>(x: T): T extends string ? string : number
  function double(x: any) {
    return x + x
  }

  const num = double(12) // Type is 12
  const str = double('x') // Type is "x"
  num //?
  str //?

  function f(x: number | string) {
    return double(x)
  }

  f(12)
  f('x')
}
