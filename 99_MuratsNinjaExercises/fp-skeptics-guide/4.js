import {pipe} from 'ramda'
// regular numbers -> eventual numbers (called  ‘isomorphism’ in Math)
// We can always turn a regular number into an eventual number by sticking it in a function.
// Wrapping everything in a function lets us control those effects with precision
// we decide exactly when those side effects happen.

function fZero() {
  console.log('Launching nuclear missiles')
  // Code to launch nuclear missiles goes here
  return 0
}
function fOne() {
  console.log('Launching nuclear missiles')
  // Code to launch nuclear missiles goes here
  return 1
}
function fTwo() {
  console.log('Launching nuclear missiles')
  // Code to launch nuclear missiles goes here
  return 2
}

// wrong: we end up invoking the function
function fIncrement(f) {
  return f() + 1
}
// fIncrement(fZero) //?

// KEYInstead, we’ll return a function that will eventually return a number:
function fIncrement2(f) {
  return () => f() + 1
}

// function waiting to be called
fIncrement2(fZero) //?
// we would have to call it to get the value out
// fIncrement2(fZero)() //? 1

//////
// fPow :: (() -> Number) -> (() -> Number) -> (() -> Number)
function fPow(a, b) {
  return () => Math.pow(a(), b())
}

// fSqrt :: (() -> Number) -> (() -> Number)
function fSqrt(x) {
  return () => Math.sqrt(x())
}

const fFour = fPow(fTwo, fTwo)
// waiting
// fFour //?
// function called, returns 4
fFour() //? 4

///////// Effect and controlling the effects
// Effect :: Function -> Effect
function Effect(f) {
  return {
    map(g) {
      return Effect(x => g(f(x)))
    },
    runEffects(x) {
      return f(x)
    },
    join(x) {
      return f(x)
    },
    chain(g) {
      return Effect(f).map(g).join()
    },
    ap(eff) {
      // If someone calls ap, we assume eff has a
      // function inside it (rather than a value).
      // We'll use map to go inside off, and access
      // that function (we'll call it 'g') Once we've
      // got g, we apply the value inside off f() to it
      return eff.map(g => g(f()))
    },
  }
}
const zero = Effect(fZero)
const increment = x => x + 1 // A plain ol' regular function.
const one = zero.map(increment)
one.runEffects() //?

const double = x => x * 2
const cube = x => Math.pow(x, 3)
const eight = Effect(fZero).map(increment).map(double).map(cube)
// we control when the effects happen
eight.runEffects() //?

///////
// KEY: law  e.map(g).map(f) === e.map(x => f(g(x)))
// doing two maps in a row is equivalent to composing the two functions

const incDoubleCube = pipe(increment, double, cube)
const eight2 = Effect(fZero).map(incDoubleCube)
eight2.runEffects() //?

//// instead of just a function as Effect's argument, we can have any value
// of :: a -> Effect a
Effect.of = function of(val) {
  return Effect(() => val)
}

const five = Effect.of({a: 5, b: 6}) //?
five.runEffects() //?

const myAppConf = {
  selectors: {
    'user-bio': '.userbio',
    'article-list': '#articles',
    'user-name': '.userfullname',
  },
  templates: {
    greet: 'Pleased to meet you, {name}',
    notify: 'You have {n} alerts',
  },
}

const config = Effect.of(myAppConf)
const userBioLocator = config.map(c => c.selectors['user-bio'])
userBioLocator.runEffects() //?
