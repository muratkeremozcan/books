// prefer types over enums

// number enums are fine, still can be a bit weird
// Which would you rather see in your JavaScript debugger or in a network request, {"flavor": 1} or {"flavor": "chocolate"}?
{
  enum Flavor {
    VANILLA,
    CHOCOLATE = 1,
    STRAWBERRY = 5,
  }

  let flavor = Flavor.CHOCOLATE // Type is Flavor

  Flavor // Autocomplete shows: VANILLA, CHOCOLATE, STRAWBERRY
  Flavor[0] // Value is "VANILLA"
  Flavor[5] // Value is "STRAWBERRY"
}

// avoid string enums, because they require consumers to import the enum, instead of just being able to use a string
{
  enum Flavor {
    VANILLA = 'vanilla',
    CHOCOLATE = 'chocolate',
    STRAWBERRY = 'strawberry',
  }

  let flavor = Flavor.CHOCOLATE // Type is Flavor
  flavor = 'strawberry'
  // ~~~~~~ Type '"strawberry"' is not assignable to type 'Flavor'

  function scoop(flavor: Flavor) {
    /* ... */
  }

  scoop('vanilla')
  scoop(Flavor.VANILLA)
}
// a union of literal types is a better solution
{
  type Flavor = 'vanilla' | 'chocolate' | 'strawberry'

  let flavor: Flavor = 'chocolate' // OK
  flavor = 'strawberry' // OK

  function scoop(flavor: Flavor) {
    /* ... */
  }

  scoop('vanilla') // OK
}
