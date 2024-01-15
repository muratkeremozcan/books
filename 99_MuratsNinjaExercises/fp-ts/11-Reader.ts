import {pipe} from 'fp-ts/function'
import {ask, chain, type Reader} from 'fp-ts/Reader'
// https://dev.to/gcanti/getting-started-with-fp-ts-reader-1ie5

/*
The purpose of the Reader monad is to avoid threading arguments through multiple functions
in order to only get them where they are needed.
By using the Reader monad, you can inject dependencies into your functions in a flexible way. 
*/

{
  const f = (b: boolean): string => (b ? 'true' : 'false')
  const g = (n: number): string => f(n > 2)
  const h = (s: string): string => g(s.length + 1)

  h('foo') //?
  h('f') //?
}

type Dependencies = {
  i18n: {
    true: string
    false: string
  }
}
const arg: Dependencies = {i18n: {true: 'vero', false: 'falso'}}

// let's say we want to internationalize f
// Problem: h and g must have knowledge about f dependencies
{
  // const f = (b: boolean): string => (b ? 'true' : 'false')
  const f = (b: boolean, deps: Dependencies): string => (b ? deps.i18n.true : deps.i18n.false)
  // const g = (n: number): string => f(n > 2)
  const g = (n: number, deps: Dependencies): string => f(n > 2, deps)

  const h = (s: string, deps: Dependencies): string => g(s.length + 1, deps)

  p
}

// using Reader, we only have to change f
{
  /*
  the Reader type is a generic type that takes two type parameters: 
	the first one (Dependencies) represents the type of the "environment" or "context", 
	the second one represents the return type of the Reader's computation (in this case, string).

  When we specify Reader<Dependencies, string>, we're declaring that this function returns a Reader instance which,
	when executed, will expect an argument of type Dependencies and will return a string.
	*/
  const f =
    (b: boolean): Reader<Dependencies, string> =>
    deps =>
      b ? deps.i18n.true : deps.i18n.false

  const g = (n: number): Reader<Dependencies, string> => f(n > 2)
  const h = (s: string): Reader<Dependencies, string> => g(s.length + 1)

  h('foo') //?
  h('foo')(arg) //?
}

// what if we want to inject another argument (lowerBound) into g?

type Dependencies2 = {
  i18n: {
    true: string
    false: string
  }
  lowerBound: number
}
const arg2: Dependencies2 = {i18n: {true: 'vero', false: 'falso'}, lowerBound: 2}

{
  const f =
    (b: boolean): Reader<Dependencies2, string> =>
    deps =>
      b ? deps.i18n.true : deps.i18n.false

  /*
	there's a composition of two Reader operations:
	ask<Dependencies2>() creates a Reader that simply provides access to the entire Dependencies2 environment.
	chain(deps => f(n > deps.lowerBound)) is then used to chain this Reader with another operation. 
	It takes the Dependencies2 environment, checks if n is greater than deps.lowerBound, and then passes the result to f.

	The pipe function is used to compose operations. 
	It starts with the Reader returned by ask, which gives access to the Dependencies2 environment.
  Then, chain is used to take the result of ask (which is the Dependencies2 object) and pass it to another function. 
	This function uses the lowerBound from the Dependencies2 object and the number n (which is provided as an argument to g) to determine the boolean value to pass to f.
	*/

  const g = (n: number): Reader<Dependencies2, string> =>
    pipe(
      ask<Dependencies2>(),
      chain(deps => f(n > deps.lowerBound)),
    )

  const h = (s: string): Reader<Dependencies2, string> => g(s.length + 1)

  h('foo') //?
  h('f')(arg2) //?
  h('foob')({...arg2, lowerBound: 4}) //?
}
