import _ from 'lodash'
import R from 'ramda'

{
  const allValues = [true, true, false, true, false]

  {
    let trueValues = []
    for (let i of allValues) {
      if (i) {
        trueValues.push(i)
      }
    }
    trueValues //?
  }

  // fp refactor
  {
    const trueValues = allValues.filter(Boolean) //?
  }

  // lodash version
  {
    const trueValues = _.filter(allValues, Boolean) //?
  }

  // ramda version (prefer data at the end)
  {
    const trueValues = R.filter(Boolean, allValues) //?

    // if we were doing more than one operation, we could use pipe
    R.pipe(R.filter(Boolean))(allValues) //?
  }
}
