// Prefer type declarations (: Type) to type assertions (as Type).
// Know how to annotate the return type of an arrow function.
// Use type assertions and non-null assertions when you know something about types that TypeScript does not.

// prefer type declaration vs type assertion
{
  interface Person {
    name: string
  }
  const alice: Person = {
    name: 'Alice',
    occupation: 'TypeScript developer',
    // ~~~~~~~~~ Object literal may only specify known properties
    //           and 'occupation' does not exist in type 'Person'
  }

  // not recommended
  const bob = {
    name: 'Bob',
    occupation: 'JavaScript developer',
  } as Person // No error

  // not recommended
  // the original syntax for type assertions is still supported, but not used because of intermixing with tsx
  const rob = <Person>{
    name: 'Rob',
    occupation: 'JavaScript developer',
  }
}

{
  interface Person {
    name: string
  }
  const people = ['alice', 'bob', 'jan'].map(name => ({name}))
  // { name: string; }[]... but we want Person[]

  // declare the return type of the function
  const people2 = ['alice', 'bob', 'jan'].map((name): Person => ({name}))
}

// When is it ok to use type assertion?
// TS does not have context of the dom, it is ok to help it with type assertions in that case
{
  document.querySelector('#myButton').addEventListener('click', e => {
    e.currentTarget // Type is EventTarget
    const button = e.currentTarget as HTMLButtonElement
    button // Type is HTMLButtonElement
  })
}

// non-null assertion operator
// Used as a prefix, ! is boolean negation. But as a suffix, ! is interpreted as an assertion that the value is non-null.
// You should treat ! just like any other assertion: it is erased during compilation,
// so you should only use it if you have information that the type checker lacks and can ensure that the value is non-null.
// If you can’t, you should use a conditional to check for the null case.
{
  const elNull = document.getElementById('foo') // Type is HTMLElement | null
  const el = document.getElementById('foo')! // Type is HTMLElement
}

// type assertion with unknown chaining
// use it when there is no overlap between the types
{
  interface Person {
    name: string
  }
  const body = document.body
  const el = body as Person
  // ~~~~~~~~~~~~~~ Conversion of type 'HTMLElement' to type 'Person'
  //                may be a mistake because neither type sufficiently
  //                overlaps with the other. If this was intentional,
  //                convert the expression to 'unknown' first
  const el2 = body as unknown as Person
}
