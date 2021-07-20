/** a factory that returns a proxied version of the writable object passed as an argument */
export function createLoggingWritable (writable) {
  // We create and return a proxy for the original writable object using the ES2015 Proxy constructor
  return new Proxy(writable, {
    // We use the get trap to intercept access to the object properties
    get (target, propKey, receiver) {
      // We check whether the property accessed is the write method
      // If that is the case, we return a function to proxy the original behavior.
      if (propKey === 'write') {
        // we extract the current chunk from the list of arguments passed to the original function, 
        // we log the content of the chunk, 
        // we invoke the original method with the given list of arguments
        return function (...args) {
          const [chunk] = args
          console.log('Writing', chunk)
          return writable.write(...args)
        }
      }
      // We return unchanged any other property
      return target[propKey]
    }
  })
}
 
