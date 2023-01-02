// Make your uses of any as narrowly scoped as possible to avoid undesired loss of type safety elsewhere in your code.
// Never return an any type from a function. This will silently lead to the loss of type safety for any client calling the function.
// you can force TypeScript to accept the error in 3 ways: //  : any, @ts-ignore, as any

// suppose you have an assignment error
interface Foo {
  foo: string
}
interface Bar {
  bar: string
}
declare function expressionReturningFoo(): Foo
function processBar(b: Bar) {
  /* ... */
}
function f0() {
  const x = expressionReturningFoo()
  processBar(x)
  //         ~ Argument of type 'Foo' is not assignable to
  //           parameter of type 'Bar'
}

function f1() {
  const x: any = expressionReturningFoo() // Don't do this
  processBar(x)
}

function f2() {
  const x = expressionReturningFoo()
  // @ts-ignore  // Don't do this
  processBar(x)
  return x
}

function f3() {
  const x = expressionReturningFoo()
  processBar(x as any) // Prefer this
}

/// what if you get an error from a property in an object?

interface Config {
  a: number
  b: number
  c: {
    key: Foo
  }
}
declare const val: Bar

const config0: Config = {
  a: 1,
  b: 2,
  c: {
    key: val,
    // ~~~ Property ... missing in type 'Bar' but required in type 'Foo'
  },
}

const config1: Config = {
  a: 1,
  b: 2,
  c: {
    key: value,
  },
} as any // Don't do this!

const config2: Config = {
  a: 1,
  b: 2,
  c: {
    // @ts-ignore // Don't do this
    key: val,
  },
}

const config3: Config = {
  a: 1,
  b: 2,
  c: {
    key: value as any, // Prefer this
  },
}
