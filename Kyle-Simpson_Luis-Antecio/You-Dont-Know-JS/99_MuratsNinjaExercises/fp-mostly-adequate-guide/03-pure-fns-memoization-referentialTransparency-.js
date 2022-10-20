import memoize from 'memoizee'

// Pure function advantages
// Cacheable (memoization)
// Portable / Self-Documenting (they don't depend on the state of the world, they come with what they need)
// Testable (input -> output)
// Referentially transparent (can be replaced with its value without changing the result of the program)

// pure vs impure: slice vs splice
const xs = [1, 2, 3, 4, 5]

// pure: the original array is not mutated
const newSlice = xs.slice(0, 3)
newSlice //?
xs //?

// impure: mutation!
const newSplice = xs.splice(0, 3)
newSplice //?
xs //?

//////////
// memoization
const myMemoize = f => {
  const cache = {}

  return (...args) => {
    const argStr = JSON.stringify(args)
    cache //?
    cache[argStr] = cache[argStr] || f(...args)
    return cache[argStr]
  }
}

const sum3 = (x, y, z) => x + y + z
const sum3Memoized = memoize(sum3)
const sum3MyMemoized = myMemoize(sum3)

// when calling the function with the same args, the cached value is used
sum3Memoized(1, 2, 3) //?
sum3Memoized(1, 2, 3) //?

sum3MyMemoized(1, 2, 3) //?
sum3MyMemoized(1, 2, 3) //?

// you can transform some impure functions into pure ones by delaying evaluation
// since with memoization we can cache every function no matter how destructive they seem
// here we don't actually make the http call - we instead return a function that will do so when called.
const pureHttpCall = memoize((url, params) => () => $.getJSON(url, params))

/////// Referential transparency is a big win with pure functions
// it means we can substitute code with hard values, and the program will behave the same

const {Map} = require('immutable')

// Aliases: p = player, a = attacker, t = target
const joe = Map({name: 'Joe', hp: 20, team: 'red'})
const michael = Map({name: 'Michael', hp: 20, team: 'green'})

const decrementHP = p => p.set('hp', p.get('hp') - 1)
const isSameTeam = (p1, p2) => p1.get('team') === p2.get('team')
// const punch = (a, t) => (isSameTeam(a, t) ? t : decrementHP(t))
const punch = (a, t) => ('red' === 'green' ? t : decrementHP(t)) // same!
// const punch = (a, t) => ('red' === 'red' ? t : decrementHP(t)) // try it out

punch(joe, michael) //?
