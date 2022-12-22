// do not use I or T prefix in the real world, it came from C# and Java, it's bad style today

// A type is, in general, more capable than an interface.
// It can be a union, and it can also take advantage of more advanced features like mapped or conditional types.

// type and interface similarities
{
  type TState = {
    name: string
    capital: string
  }
  interface IState {
    name: string
    capital: string
  }

  // function types
  type TFnWithProperties = {
    (x: number): number
    prop: string
  }
  interface IFnWithProperties {
    (x: number): number
    prop: string
  }

  // generics
  type TPair<T> = {
    first: T
    second: T
  }
  interface IPair<T> {
    first: T
    second: T
  }

  // they can extend each other
  interface IStateWithPop extends TState {
    population: number
  }
  type TStateWithPop = IState & {population: number}

  // classes can implement either
  class StateT implements TState {
    name: string = ''
    capital: string = ''
  }
  class StateI implements IState {
    name: string = ''
    capital: string = ''
  }

  // differences between type and interface

  // union types are only with types
  type AorB = 'a' | 'b'

  type Input = {
    /* ... */
  }
  type Output = {
    /* ... */
  }
  interface VariableMap {
    [name: string]: Input | Output
  }
  // if you wanted a type that attaches the name to the variable, you can use types but not interfaces
  type NamedVariable = (Input | Output) & {name: string}

  // expressing tuples is easier with types
  type Pair = [number, number]
  type StringList = string[]
  type NamedNums = [string, ...number[]]
  // harder with interfaces (and drops methods like concat)
  interface Tuple {
    0: number
    1: number
    length: 2
  }
  const t: Tuple = [10, 20] // OK
}

// KEY: the single advantage of interfaces over types is augmentation, aka declaration merging
{
  interface IState {
    name: string
    capital: string
  }
  interface IState {
    population: number
  }
  const wyoming: IState = {
    name: 'Wyoming',
    capital: 'Cheyenne',
    population: 500_000,
  } // OK
}
