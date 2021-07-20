import { createReadStream } from 'fs'
import { createBrotliCompress } from 'zlib'
import { PassThrough } from 'stream'
import { basename } from 'path'
import { upload } from './upload.js'

// Pattern: Use a PassThrough stream when you need to provide a placeholder for data 
// that will be read or written in the future.


// We get the path to the file we want to upload from the first command-line argument
const filepath = process.argv[2]
// and use basename to extrapolate the filename from the given path
const filename = basename(filepath)
// We create a placeholder for our content stream as a PassThrough instance
const contentStream = new PassThrough()

// Now, we invoke the upload function by passing our filename (with the added .br suffix, indicating that it is using the Brotli compression) and the placeholder content stream
upload(`${filename}.br`, contentStream) // ③
  .then((response) => {
    console.log(`Server response: ${response.data}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

  // Finally, we create a pipeline by chaining a filesystem Readable stream, a Brotli compression Transform stream, and finally our content stream as the destination
createReadStream(filepath) // ④
  .pipe(createBrotliCompress())
  .pipe(contentStream)
