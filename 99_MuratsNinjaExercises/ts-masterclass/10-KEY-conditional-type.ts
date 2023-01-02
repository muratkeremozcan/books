// use the ternary operator to define a conditional type
type IsString<T> = T extends string ? true : false

type A = IsString<string> // A === true
type B = IsString<'abc'> // B === true
type C = IsString<123> // C === false

// ex: NonNullable custom type is a distributed conditional type
// (if it extends null or undefined, should never happen, otherwise return the type)
type NonNullValue<T> = T extends null | undefined ? never : T

function print<T>(p: NonNullValue<T>): void {
  console.log(p)
}

print('Test') // compiles
// print(null); // does not compile

////// Exercise
// Define two types, Not and Or.
// Not, given a true Boolean literal type, should return false.
// Or should act like the logical OR operator, but on Boolean literal types.
{
  type Not<T extends boolean> = T extends true ? false : true

  type Or<T> = T extends [true, true]
    ? true
    : T extends [true, false]
    ? true
    : T extends [false, true]
    ? true
    : T extends [false, false]
    ? false
    : never

  const foo: Not<true> = false //?
  const fooo: Not<false> = true

  const bar: Or<[true, false]> = true
  const barr: Or<[false, false]> = false
}

//// Adding a property conditionally
interface Persona {
  name: string
  dateCreated: Date
}
interface Animala {
  name: string
}

// if dateCreated exists in the type, add a new property modifiedDate
type Modified<T> = T extends {dateCreated: Date}
  ? T & {modifiedDate: Date}
  : never

const pp: Persona = {name: 'Pat', dateCreated: new Date()}
const aa: Animala = {name: 'Jack'}

const persona: Modified<Persona> = {...pp, modifiedDate: new Date()}
// const animala: Modified<Animala> = {...aa, modifiedDate: new Date()} // error

///// Infer keyword
// infer creates a new type variable, P, that will store the type parameter of T if it indeed extends some type

type IsReactComponent1<T> = T extends React.ComponentType<any> ? 'yes' : 'no'

type IsReactComponent2<T> = T extends React.ComponentType<infer P>
  ? 'yes'
  : 'no'

type IsReactComponent<T> = T extends React.ComponentType<infer P> ? P : 'no'
