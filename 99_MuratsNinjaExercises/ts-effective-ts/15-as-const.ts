// Be aware of how context is used in type inference.
// If factoring out a variable introduces a type error, consider adding a type declaration.
// If the variable is truly a constant, use a const assertion (as const).

{
  type Language = 'JavaScript' | 'TypeScript' | 'Python'
  function setLanguage(language: Language) {
    /* ... */
  }
  // Parameter is a (latitude, longitude) pair.
  function panTo(where: [number, number]) {
    /* ... */
  }

  panTo([10, 20]) // OK

  const loc = [10, 20]
  panTo(loc)
  //    ~~~ Argument of type 'number[]' is not assignable to
  //        parameter of type '[number, number]'
}

// use a type when making the assignment
{
  type Language = 'JavaScript' | 'TypeScript' | 'Python'
  function setLanguage(language: Language) {
    /* ... */
  }
  // Parameter is a (latitude, longitude) pair.
  function panTo(where: [number, number]) {
    /* ... */
  }

  panTo([10, 20]) // OK

  // using a type
  const loc: [number, number] = [10, 20]
  panTo(loc)
}

// as const (aka const context) tells TS that you intend the value to be deeply constant, rather than the shallow constant
{
  type Language = 'JavaScript' | 'TypeScript' | 'Python'
  function setLanguage(language: Language) {
    /* ... */
  }

  // because loc is readonly with as const, the arg also needs to be readonly
  function panTo(where: readonly [number, number]) {
    /* ... */
  }

  // using as const
  const loc = [10, 20] as const
  panTo(loc)
}

// the same issue can happen with objects
{
  type Language = 'JavaScript' | 'TypeScript' | 'Python'
  interface GovernedLanguage {
    language: Language
    organization: string
  }

  function complain(language: GovernedLanguage) {
    /* ... */
  }

  complain({language: 'TypeScript', organization: 'Microsoft'}) // OK

  const ts = {
    language: 'TypeScript',
    organization: 'Microsoft',
  }
  complain(ts)
  //       ~~ Argument of type '{ language: string; organization: string; }'
  //            is not assignable to parameter of type 'GovernedLanguage'
  //          Types of property 'language' are incompatible
  //            Type 'string' is not assignable to type 'Language'
}

// use a type when making the assignment
{
  type Language = 'JavaScript' | 'TypeScript' | 'Python'
  interface GovernedLanguage {
    language: Language
    organization: string
  }

  function complain(language: GovernedLanguage) {
    /* ... */
  }

  complain({language: 'TypeScript', organization: 'Microsoft'}) // OK

  // using a type
  const ts: GovernedLanguage = {
    language: 'TypeScript',
    organization: 'Microsoft',
  }
  complain(ts)
}

// use as const
{
  type Language = 'JavaScript' | 'TypeScript' | 'Python'
  interface GovernedLanguage {
    language: Language
    organization: string
  }

  function complain(language: GovernedLanguage) {
    /* ... */
  }

  complain({language: 'TypeScript', organization: 'Microsoft'}) // OK

  const ts = {
    language: 'TypeScript',
    organization: 'Microsoft',
  } as const
  complain(ts)
}
