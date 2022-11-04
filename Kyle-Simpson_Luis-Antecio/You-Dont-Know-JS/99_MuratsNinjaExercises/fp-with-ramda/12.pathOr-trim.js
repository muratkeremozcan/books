import * as R from 'ramda'

const someText = 'Hello  \n'
const trimmedText = someText.trim() //?
const trimmedTextR = R.trim(someText) //?
trimmedTextR === trimmedText //?

const e = {
  target: {
    value: someText,
  },
}
R.path(['target', 'value'])(e) //?
// returns the path or default value
R.pathOr(7, ['target', 'value'])(e) //?
R.pathOr(7, ['target', 'val'])(e) //?
R.pathOr(7, ['target', 'value'])(null) //?
//

const classic = event => R.trim(R.pathOr('', ['target', 'value'])(event))
const ramda = R.pipe(R.pathOr('', ['target', 'value']), R.trim)
classic(e) //?
ramda(e) //?
