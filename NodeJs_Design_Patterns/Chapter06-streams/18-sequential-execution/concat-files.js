import { createWriteStream, createReadStream } from 'fs'
import { Readable, Transform } from 'stream'

// Pattern: Use a stream, or combination of streams, to easily iterate over a set of asynchronous tasks in sequence

export function concatFiles (dest, files) {
  return new Promise((resolve, reject) => {
    const destStream = createWriteStream(dest)
    // we use Readable.from() to create a Readable stream from the files array. 
    // This stream operates in object mode (the default setting for streams created with Readable.from())
    //  and it will emit filenames: every chunk is a string indicating the path to a file.
    // The order of the chunks respects the order of the files in the files array
    Readable.from(files)
      // we create a custom Transform stream to handle each file in the sequence.
      // Since we are receiving strings, we set the option objectMode to true.
      // In our transformation logic, for each file, we create a Readable stream to read the file content 
      // and pipe it into destStream (a Writable stream for the destination file). 
      // We make sure not to close destStream after the source file finishes reading by specifying { end: false } in the pipe() options
      .pipe(new Transform({ // ②
        objectMode: true,
        transform (filename, enc, done) {
          const src = createReadStream(filename)
          src.pipe(destStream, { end: false })
          src.on('error', done)
          // When all the contents of the source file have been piped into destStream,
          //  we invoke the done function to communicate the completion of the current processing, 
          // which is necessary to trigger the processing of the next file
          src.on('end', done)
        }
      }))
      .on('error', reject)
      // When all the files have been processed, the finish event is fired; 
      // we can finally end destStream and invoke the cb() function of concatFiles(), 
      // which signals the completion of the whole operation.
      .on('finish', () => {
        destStream.end()
        resolve()
      })
  })
}
