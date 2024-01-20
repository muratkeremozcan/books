// https://cjonas.gitbook.io/mostly-adequate-fp-ts/chapter-5
import {map} from 'fp-ts/Array'
import {flow, pipe} from 'fp-ts/function'
import {join, replace, split, toLower} from 'ramda'

// fp-ts provides flow
// basically pipe in Ramda
// pipe in fp-ts takes the first argument as the input

const toUpperCase = (x: string) => x.toUpperCase()
const exclaim = (x: string) => `${x}!`
// flow is like pipe in ramda
const shout = flow(toUpperCase, exclaim)

////////////
// fp

// just use ramda...
// const join = (sep: string) => (s: string[]) =>
//   intercalate(S.Monoid, Foldable)(sep, s)

const dasherize = flow(replace(/\s{2,}/gi)(' '), split(' '), map(toLower), join('-'))
dasherize('The world is a vampire') //?

const dasherizeP = pipe(
  'The world is a vampire',
  replace(/\s{2,}/gi)(' '),
  split(' '),
  map(toLower),
  join('-'),
)
dasherizeP //?
