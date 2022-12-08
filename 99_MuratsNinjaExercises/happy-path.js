// https://glebbahmutov.com/blog/kleisli/

const fs = require('fs')
const R = require('ramda')
const Task = require('data.task')
const Either = require('data.either')

{
  const read = path => fs.readFileSync(path)
  const check = buffer => (buffer.length > 0 ? buffer : null)
  const decode = encoding => buffer => buffer.toString(encoding)
  const count = text => text.split(' ').length
  const processFile = path => count(decode('utf8')(check(read(path))))
  processFile('./text.txt') //?

  const processFileR = R.pipe(read, check, decode('utf8'), count)
  processFileR('./text.txt') //?
}

// using a monad for error checking

{
  // read : String -> Task(Error, Buffer)
  function read(path) {
    return new Task(function (reject, resolve) {
      fs.readFile(path, function (error, data) {
        if (error) reject(error)
        else resolve(data)
      })
    })
  }

  // check : Buffer -> Either(Buffer)
  const check = buffer =>
    buffer.length > 0
      ? Either.Right(buffer) // success!
      : Either.Left('File is empty') // failure

  // decode : String -> Buffer -> String
  const decode = encoding => buffer => buffer.toString(encoding)

  // count :: String -> Number
  const count = text => text.split(' ').length

  const asEither = R.o(Either.of)

  // processBuffer :: Buffer -> Either(Number)
  const processBuffer = R.pipe(
    check, // Either(Buffer)
    asEither(decode('utf8')), // Either(String)
    asEither(count), // Either(Number)
  )

  const asTask = R.o(Task.of)

  // processFile :: String -> Task(Either(Number))
  const processFile = R.pipe(
    read, // Task(Error, Buffer)
    asTask(processBuffer), // Task(Either(Number))
  )

  // test.split is not a function...
  processFile('./text.txt') //?
}
