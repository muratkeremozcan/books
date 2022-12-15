// The type never means that nothing occurs.
// It is used when a type guard cannot occur or in a situation where an exception is always thrown
// A function with return type of never won’t allow to return undefined / void,
// A function with return type of void allows to return undefined / void

// never is a subtype of every type, so we could just have the return type as : boolean
function functionThrow(a: boolean): boolean | never {
  if (a) throw new Error('return nevers')
  return a
  // if we didn't return but instead use a console.log, we'd get an error
  // "A function whose declared type is neither 'void' nor 'any' must return a value."
  // console.log(a)
}

functionThrow(false) //?
functionThrow(true) //?
