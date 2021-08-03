import { CancelError } from './cancelError.js'

// Our wrapper is created through a factory function called createCancelWrapper(). 
// The factory returns two functions: the wrapper function (cancelWrapper) and 
// a function to trigger the cancellation of the asynchronous operation (cancel).

export function createCancelWrapper () {
  let cancelRequested = false

  function cancel () {
    cancelRequested = true
  }

  function cancelWrapper (func, ...args) {
    if (cancelRequested) {
      return Promise.reject(new CancelError())
    }
    return func(...args)
  }

  return { cancelWrapper, cancel }
}
