import { createGzip, createGunzip } from 'zlib'
import { Transform, pipeline } from 'stream'

// Reads a Gzip data stream from the standard input 
// Decompresses the data 
// Makes all the text uppercase 
// Gzips the resulting data Sends the data back to the standard output


// Create a transform stream that uppercases the input
const uppercasify = new Transform({
  transform (chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase())
    cb()
  }
})

// We define our pipeline, where we list all the stream instances in order.
pipeline(
  process.stdin,
  createGunzip(),
  uppercasify,
  createGzip(),
  process.stdout,
  (err) => { // add a callback to monitor the completion of the stream. In the event of an error, we print the error in the standard error interface, and we exit with error code 1
    if (err) {
      console.error(err)
      process.exit(1)
    }
  }
)
