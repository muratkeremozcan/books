import {toUpper, toLower, head, tail, curry} from 'ramda'

// takes a string, returns a string
// capitalize :: String -> String
const capitalize = (s: string) => toUpper(head(s)) + toLower(tail(s))

capitalize('smurf') //?

// strLength :: String -> Number
const strLength = (s: string) => s.length
strLength('abcd') //?

// takes a String and a String array, returns a string
// join :: String -> [String] -> String
const join = curry((what: string, xs: string[]): string => xs.join(what))
join('-')(['b', 'c', 'd']) //?

// takes a Regex and a String and returns you [String]
// takes a Regex and returns us a function from String to [String] (because of currying)
// match :: Regex -> String -> [String]
// match :: Regex -> (String -> [String])
const match = curry((reg: RegExp, s: string): RegExpMatchArray | null =>
  s.match(reg),
)
match(/\s+/g, 'hello world') //?

// Each argument pops one type off the front of the signature. onHoliday is match that already has a Regex.
// match :: Regex -> (String -> [String])
// onHoliday :: String -> [String]
const onHoliday = match(/holiday/gi)
onHoliday('I love holidays') //?

// takes a Regex, a String, another String, returns a String
// replace :: Regex -> String -> String -> String
// replace :: Regex -> (String -> (String -> String))
const replace = curry((reg: RegExp, sub: string, s: string): string =>
  s.replace(reg, sub),
)
replace(/\s+/g)('-')('hello world') //?

// a and b are just variable names in types
// a -> b can be any type a to any type b,
// but a -> a means it has to be the same type.

// takes any type and returns the same type
// id :: a -> a
const id2 = <T>(x: T): T => x
id2(5) //?

// takes an array of any type, returns one of the same type
// head :: [a] -> a
const head2 = <T>(xs: T[]): T => xs[0]
head2([1, 2, 3]) //?

// map takes a function from any type a to the same or different type b,
// then takes an array of a's and results in an array of b's.
// map :: (a -> b) -> [a] -> [b]
// function map<T, U>(fn: (x: T) => U, list: readonly T[]): U[]
const map2 = curry((f, xs) => xs.map(f))
map2((x: number) => x * 2)([1, 2, 3]) //?

// takes a function b & a, produces b
// following that is a b, and an array of a's, and returns a b
// reduce :: ((b, a) -> b) -> b -> [a] -> b
// function reduce<T, TResult>(fn: (acc: TResult, elem: T) => TResult | Reduced<TResult>, acc: TResult, list: readonly T[]): TResult
const reduce2 = curry((f, x, xs) => xs.reduce(f, x))
reduce2((acc: any, x: any) => acc + x, 0)([1, 2, 3]) //?
