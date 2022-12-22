// The DRY (don’t repeat yourself) principle applies to types as much as it applies to logic.
// Name types rather than repeating them.
// Use extends to avoid repeating fields in interfaces.
// Build an understanding of the tools provided by TypeScript to map between types.
/// These include keyof, typeof, indexing, and mapped types.
// Generic types are the equivalent of functions for types. Use them to map between types

// let's say you have a type and you want another one that's a subset of it

// duplication in subsets
{
  interface State {
    userId: string
    pageTitle: string
    recentFiles: string[]
    pageContents: string
  }
  // some duplication
  interface ITopNavState {
    userId: string
    pageTitle: string
    recentFiles: string[]
  }
  // can remove some duplication by indexing
  type TTopNavState = {
    userId: State['userId']
    pageTitle: State['pageTitle']
    recentFiles: State['recentFiles']
  }
  // can remove more duplication with mapped type
  type TTopNavState2 = {
    [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
  }
  // meta: use Pick
  type TTopNavState3 = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>
}

// duplication with tagged unions
{
  interface SaveAction {
    type: 'save'
    // ...
  }
  interface LoadAction {
    type: 'load'
    // ...
  }
  type Action = SaveAction | LoadAction

  type ActionType1 = 'save' | 'load' // Repeated types!

  // with this, you can add more types to the union without having to change the type
  type ActionType2 = Action['type'] // Type is "save" | "load"
  // careful, what you get with Pick is different
  type ActionRec = Pick<Action, 'type'> // {type: "save" | "load"}
}

// duplication in classes
{
  interface Options {
    width: number
    height: number
    color: string
    label: string
  }
  interface OptionsUpdate {
    width?: number
    height?: number
    color?: string
    label?: string
  }
  class UIWidget {
    constructor(init: Options) {
      /* ... */
    }
    update(options: OptionsUpdate) {
      /* ... */
    }
  }

  // You can construct OptionsUpdate from Options using a mapped type and keyof:
  type OptionKeys = keyof Options
  type OptionsUpdate2 = {[k in OptionKeys]?: Options[k]}
  class UIWidget2 {
    constructor(init: Options) {
      /* ... */
    }
    update(options: OptionsUpdate2) {
      /* ... */
    }
  }

  // meta: use Partial
  class UIWidget3 {
    constructor(init: Options) {
      /*... */
    }
    update(options: Partial<Options>) {
      /* ... */
    }
  }
}

// define a type that matches the shape of a value
{
  const INIT_OPTIONS = {
    width: 640,
    height: 480,
    color: '#00FF00',
    label: 'VGA',
  }
  interface IOptions {
    width: number
    height: number
    color: string
    label: string
  }

  // instead, use type and typeof
  type TOptions = typeof INIT_OPTIONS
}

// create a type for the inferred return value of a function using ReturnType
{
  type UserInfo = ReturnType<typeof getUserInfo>
  function getUserInfo(userId: string) {
    const name = 'Bob'
    const age = 12
    const height = 48
    const weight = 70
    const favoriteColor = 'blue'
    return {
      userId,
      name,
      age,
      height,
      weight,
      favoriteColor,
    }
  }
}

// constrain the parameters in a generic type using Pick
{
  type Name = {
    first: string
    last: string
  }
  type DancingDuo<T extends Name> = [T, T]

  const couple1: DancingDuo<Name> = [
    {first: 'Fred', last: 'Astaire'},
    {first: 'Ginger', last: 'Rogers'},
  ] // OK
  // how do you constrain it?
  const couple2: DancingDuo<{first: string}> = [
    // ~~~~~~~~~~~~~~~
    // Property 'last' is missing in type
    // '{ first: string; }' but required in type 'Name'
    {first: 'Sonny'},
    {first: 'Cher'},
  ]

  // constrain the type to just first, using Pick or Omit
  type NameFirstOnly = Pick<Name, 'first'>
  type DancingDuo2<T extends NameFirstOnly> = [T, T]

  const couple3: DancingDuo2<{first: string}> = [{first: 'Sonny'}, {first: 'Cher'}] // OK

  type LastNameOnly = Omit<Name, 'first'>
  type DancingDuo3<T extends LastNameOnly> = [T, T]
  const couple4: DancingDuo3<{last: string}> = [{last: 'Sonny'}, {last: 'Cher'}] // OK
}
