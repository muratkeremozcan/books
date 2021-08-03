import { CancelError } from './cancelError.js'

// First, we should note that the createAsyncCancelable() function takes, as input, a generator function (the supervised function)
// and returns another function (asyncCancelable()) that wraps the generator function with our supervising logic. 
// The asyncCancelable() function is what we will use to invoke the asynchronous operation.
export function createAsyncCancelable (generatorFunction) {
  return function asyncCancelable (...args) {

    // When invoked, the first task of asyncCancelable() is to invoke the generator function with the arguments received as input (args)
    // and obtain a generator object, which we can use to control the execution flow of the running coroutine.
    const generatorObject = generatorFunction(...args)
    let cancelRequested = false

    function cancel () {
      cancelRequested = true
    }

    const promise = new Promise((resolve, reject) => {
      // The entire logic of the supervisor is implemented within the nextStep() function, 
      // which is responsible for iterating over the values yielded by the supervised coroutine (prevResult). 
      // Those can be actual values or promises. 
      // If a cancelation is requested, we throw the usual CancelError; otherwise, if the coroutine has been terminated (for example, prevResult.done is true),
      // we immediately resolve the outer promise and complete the return.
      async function nextStep (prevResult) {
        if (cancelRequested) {
          return reject(new CancelError())
        }

        if (prevResult.done) {
          return resolve(prevResult.value)
        }

        try {
          // The core part of the nextStep() function is where we retrieve the next value yielded by the supervised coroutine 
          // We await on that value so we can make sure we get the actual resolution value in case we are dealing with a promise. 
          //  This also makes sure that if prevResult.value is a promise and it rejects, we end up in the catch statement. 
          // We can end up in the catch statement even if the supervised coroutine actually throws an exception.
          nextStep(generatorObject.next(await prevResult.value))
        } catch (err) {
          try {
            nextStep(generatorObject.throw(err))
          } catch (err2) {
            reject(err2)
          }
        }
      }

      nextStep({})
    })

    // The asyncCancelable() function returns an object with two properties: 
    // The promise property, which contains the promise representing the eventual resolution (or rejection) of the asynchronous operation. 
    // The cancel property, which is a function that can be used to cancel the supervised asynchronous flow.
    return { promise, cancel }
  }
}
