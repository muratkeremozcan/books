import {curry, ifElse} from 'ramda'
import * as _ from 'lodash'

// When we spoke about pure functions, we said they take 1 input to 1 output.
// Currying does exactly this: each single argument returns a new function expecting the remaining arguments.

const add = (x: number) => (y: any) => x + y
add(1) //?
// by currying, the first argument is remembered via closure
add(1)(2) //?

///////

const match = curry((what: any, s: string) => s.match(what))
const replace = curry((what: any, replacement: any, s: string) =>
  s.replace(what, replacement),
)
const filter = curry((f: any, xs: any[]) => xs.filter(f))
const map = curry((f: any, xs: any[]) => xs.map(f))

// functions wait until all arguments are provided
// in other words, we "pre-load" a function with arguments in order to receive a new function that remembers those arguments

match(/r/g, 'hello world') //?
const hasLetterR = match(/r/g)
hasLetterR('hello world') //?
filter(hasLetterR, ['rock and roll', 'smooth jazz']) //?
const removeStringsWithoutRs = filter(hasLetterR)
removeStringsWithoutRs(['rock and roll', 'smooth jazz', 'drum circle']) //?

const noVowels = replace(/[aeiou]/gi)
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
const allTheChildrenL = (
  elements: (
    | {
        childNodes: {
          a: number
          b: number
          c: number
        }
      }
    | {
        childNodes: {
          d: number
          e: number
          f: number
        }
      }
  )[],
) => _.map(elements, getChildren) // lodash version, much boilerplate
const allTheChildrenR = map(getChildren) // ramda version, much less boilerplate

allTheChildrenC(node) //?
allTheChildrenL(node) //?
allTheChildrenR(node) //?

///////// exercises
const split = curry((sep: any, str: string) => str.split(sep))
// Refactor to remove all arguments by partially applying the function.
const wordsC = (str: string) => split(' ', str)
const wordsR = split(' ')

wordsC('Jingle bells Batman smells') //?
wordsR('Jingle bells Batman smells') //?

// Refactor to remove all arguments by partially applying the functions.
const filterQs = (xs: string[]) => filter((x: any) => match(/q/i, x), xs)
const matchQ = (x: any) => match(/q/i, x)
const filterQs2 = (xs: string[]) => filter(matchQ, xs)
// that's as far as you can go
// now with currying
const matchQR = match(/q/i)
const filterQsR = filter(matchQR)

filterQs(['quick', 'camels', 'quarry', 'over', 'quails']) //?
filterQs2(['quick', 'camels', 'quarry', 'over', 'quails']) //?
filterQsR(['quick', 'camels', 'quarry', 'over', 'quails']) //?

///

const keepHighest = (x: number, y: number) => (x >= y ? x : y)

const compare = (x: number, y: number) => (x >= y ? x : y)
const keepHighestR = curry(compare)
keepHighestR(5) //?
keepHighestR(3, 10) //?

const compareR = ifElse(
  (x: number, y: number) => x >= y,
  (x: number) => x,
  (_, y: number) => y,
)

const keepHighestR2 = curry(compareR)
keepHighestR2(5) //?
keepHighestR2(3, 10) //?
