
import { randomBytes } from 'crypto'

/**generic function that promisifies a Node.js-style callback-based function */
function promisify (callbackBasedApi) {
  // creates a new Promise using the Promise constructor and immediately returns it to the caller
  return function promisified (...args) {
    return new Promise((resolve, reject) => {
      // Since we know that the callback always comes last, we simply append it to the arguments list (args) provided to the promisified() function
      const newArgs = [
        ...args,
        function (err, result) {
          // in the cb, we reject if there is an error, resolve otherwise
          if (err) {
            return reject(err)
          }
          resolve(result)
        }
      ]
      // call the original function with the new arguments
      callbackBasedApi(...newArgs)
    })
  }
}

// The randomBytes() produces a buffer containing the specified number of random bytes
// it accepts a callback as the last argument and it follows the conventions we know for callbacks
const randomBytesP = promisify(randomBytes)

randomBytesP(32)
  .then(buffer => {
    console.log(`Random bytes: ${buffer.toString()}`)
  })


// note : in real life use https://nodejs.org/api/util.html#util_util_promisify_original

const util = require('util');

util.promisify(randomBytes)(32).then(buffer=> {
  console.log(`Random bytes: ${buffer.toString()}`)
})