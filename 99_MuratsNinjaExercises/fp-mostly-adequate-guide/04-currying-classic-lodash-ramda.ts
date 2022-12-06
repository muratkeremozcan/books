import {curry, ifElse} from 'ramda'
import * as _ from 'lodash'

// When we spoke about pure functions, we said they take 1 input to 1 output.
// Currying does exactly this: each single argument returns a new function expecting the remaining arguments.

const add = (x: number) => (y: number) => x + y
add(1) //?
// by currying, the first argument is remembered via closure
add(1)(2) //?

///////

const matchCurried = curry((what: RegExp, s: string) => s.match(what))
const replaceCurried = curry((what: RegExp, replacement: string, s: string) =>
  s.replace(what, replacement),
)
const filterCurried = curry((f: any, xs: any[]) => xs.filter(f))
const mapCurried = curry((f: any, xs: any[]) => xs.map(f))

// functions wait until all arguments are provided
// in other words, we "pre-load" a function with arguments in order to receive a new function that remembers those arguments

matchCurried(/r/g, 'hello world') //?
const hasLetterR = matchCurried(/r/g)
hasLetterR('hello world') //?
filterCurried(hasLetterR, ['rock and roll', 'smooth jazz']) //?
const removeStringsWithoutRs = filterCurried(hasLetterR)
removeStringsWithoutRs(['rock and roll', 'smooth jazz', 'drum circle']) //?

const noVowels = replaceCurried(/[aeiou]/gi)
const censored = noVowels('*') //?
censored('Chocolate Rain') //?

const node = [
  {
    childNodes: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
  {
    childNodes: {
      d: 4,
      e: 5,
      f: 6,
    },
  },
]

const getChildren = (x: {childNodes: any}) => x.childNodes
const allTheChildrenC = (elements: any[]) => elements.map(getChildren) // classic version, much boilerplate
const allTheChildrenL = (elements: {childNodes: any}[]) =>
  _.map(elements, getChildren) // lodash version, much boilerplate
const allTheChildrenR = mapCurried(getChildren) // ramda version, much less boilerplate

allTheChildrenC(node) //?
allTheChildrenL(node) //?
allTheChildrenR(node) //?

///////// exercises
const split = curry((sep: any, str: string) => str.split(sep))
// Refactor to remove all arguments by partially applying the function.
const wordsC = (str: string) => split(' ', str)
const wordsR = split(' ') // since it's curried, we can pass the arg later

wordsC('Jingle bells Batman smells') //?
wordsR('Jingle bells Batman smells') //?

// Refactor to remove all arguments by partially applying the functions.
const filterQs = (xs: string[]) =>
  filterCurried((x: any) => matchCurried(/q/i, x), xs)
const matchQ = (x: any) => matchCurried(/q/i, x)
const filterQs2 = (xs: string[]) => filterCurried(matchQ, xs)
// that's as far as you can go
// now with currying
const matchQR = matchCurried(/q/i)
const filterQs3 = filterCurried(matchQR)

filterQs(['quick', 'camels', 'quarry', 'over', 'quails']) //?
filterQs2(['quick', 'camels', 'quarry', 'over', 'quails']) //?
filterQs3(['quick', 'camels', 'quarry', 'over', 'quails']) //?

///

const keepHighest = (x: number, y: number) => (x >= y ? x : y)

const compare = (x: number, y: number) => (x >= y ? x : y)
const keepHighestCurried = curry(compare)
keepHighestCurried(5) //?
keepHighestCurried(3, 10) //?

const compareR = ifElse(
  (x: number, y: number) => x >= y,
  (x: number) => x,
  (_, y: number) => y,
)

const keepHighestCurried2 = curry(compareR)
keepHighestCurried2(5) //?
keepHighestCurried2(3, 10) //?
