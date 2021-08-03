import { asyncRoutine } from './asyncRoutine.js'
import { CancelError } from './cancelError.js'

// The cancelable() function receives, as input, an object (cancelObj) containing a single property called cancelRequested.
// In the function, we check the cancelRequested property after every asynchronous call, 
// and if that's true, we throw a special CancelError exception to interrupt the execution of the function.

async function cancelable (cancelObj) {
  const resA = await asyncRoutine('A')
  console.log(resA)
  if (cancelObj.cancelRequested) {
    throw new CancelError()
  }

  const resB = await asyncRoutine('B')
  console.log(resB)
  if (cancelObj.cancelRequested) {
    throw new CancelError()
  }

  const resC = await asyncRoutine('C')
  console.log(resC)
}

const cancelObj = { cancelRequested: false }
cancelable(cancelObj)
  .catch(err => {
    if (err instanceof CancelError) {
      console.log('Function canceled')
    } else {
      console.error(err)
    }
  })

setTimeout(() => {
  cancelObj.cancelRequested = true
}, 100)
