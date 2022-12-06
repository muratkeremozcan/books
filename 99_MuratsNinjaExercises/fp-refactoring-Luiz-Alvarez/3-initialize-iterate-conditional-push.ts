import _ from 'lodash'
import R from 'ramda'

{
  const words = ['Marty', 'Doc', 'Einstein']

  {
    let longWords = []
    for (let i of words) {
      if (i.length >= 5) {
        longWords.push(i)
      }
    }
    longWords //?
  }

  // FP refactor
  {
    // curred version of (num, word) => word.length >= num
    const largerThan = (num: number) => (word: string) => word.length >= num
    const largerThanFive = largerThan(5)
    const longWords = words.filter(largerThanFive)
    longWords //?
  }

  // with lodash curry
  // wrap the function in _.curry
  {
    const largerThan = _.curry(
      (num: number, word: string) => word.length >= num,
    )
    const largerThanFive = largerThan(5)
    const longWords = words.filter(largerThanFive)
    longWords //?
  }

  // with ramda curry
  {
    const largerThan = R.curry(
      (num: number, word: string) => word.length >= num,
    )
    const largerThanFive = largerThan(5)

    const longWords = words.filter(largerThanFive)
    longWords //?

    // version 2
    const longWords2 = R.filter(largerThanFive)(words)
    longWords2 //?

    // write the above with R.pipe (would be useful if we were doing more than filtering)
    const longWords3 = R.pipe(R.filter(largerThanFive))(words)
    longWords3 //?
  }
}
