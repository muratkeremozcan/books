import { pipeline } from 'stream'
import { createReadStream, createWriteStream } from 'fs'
import split from 'split'
import request from 'request-promise'
import { LimitedParallelStream } from './limited-parallel-stream.js'

pipeline(
  // we create a Readable stream from the file given as input.
  createReadStream(process.argv[2]),
  // we split the stream into lines
  split(),
  // Then, it's time to use our ParallelStream to check the URL. 
  // We do this by sending a head request and waiting for a response. 
  // When the operation completes, we push the result down the stream.
  new LimitedParallelStream(
    4,
    async (url, enc, push, done) => {
      if (!url) {
        return done()
      }
      console.log(url)
      try {
        await request.head(url, { timeout: 5 * 1000 })
        push(`${url} is up\n`)
      } catch (err) {
        push(`${url} is down\n`)
      }
      done()
    }
  ),
  // Finally, all the results are piped into a file, results.txt
  createWriteStream('results.txt'),
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('All urls have been checked')
  }
)
