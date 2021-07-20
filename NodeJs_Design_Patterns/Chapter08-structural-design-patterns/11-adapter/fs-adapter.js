import { resolve } from 'path'

export function createFSAdapter (db) {
  return ({
    readFile (filename, options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      } else if (typeof options === 'string') {
        options = { encoding: options }
      }

      // To retrieve a file from the db instance, we invoke db.get(), using filename as a key, 
      // by making sure to always use its full path (using resolve()). 
      // We set the value of the valueEncoding option used by the database to be equal to any eventual encoding option received as an input.
      db.get(resolve(filename), {
        valueEncoding: options.encoding
      },
      (err, value) => {
        // If the key is not found in the database, we create an error with ENOENT as the error code,
        // which is the code used by the original fs module to indicate a missing file.
        // Any other type of error is forwarded to callback (for the scope of this example, 
        // we are adapting only the most common error condition)
        if (err) {
          if (err.type === 'NotFoundError') { // ②
            err = new Error(`ENOENT, open "${filename}"`)
            err.code = 'ENOENT'
            err.errno = 34
            err.path = filename
          }
          return callback && callback(err)
        }
        // If the key-value pair is retrieved successfully from the database,
        //  we will return the value to the caller using the callback
        callback && callback(null, value) // ③
      })
    },

    writeFile (filename, contents, options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      } else if (typeof options === 'string') {
        options = { encoding: options }
      }

      db.put(resolve(filename), contents, {
        valueEncoding: options.encoding
      }, callback)
    }
  })
}






// If the key-value pair is retrieved successfully from the database, we will return the value to the caller using the callback.
