import { pipeline } from 'stream'
import { createReadStream, createWriteStream } from 'fs'
import split from 'split'
import superagent from 'superagent'
import { ParallelStream } from './parallel-stream.js'

pipeline(
  createReadStream(process.argv[2]), // we create a Readable stream from the file given as input
  split(), // We pipe the contents of the input file through split (nodejsdp.link/split), a Transform stream that ensures each line is emitted in a different chunk
  // Then, it's time to use our ParallelStream to check the URL. We do this by sending a head request and waiting for a response. 
  // When the operation completes, we push the result down the stream
  new ParallelStream( 
    async (url, enc, push, done) => {
      if (!url) {
        return done()
      }
      try {
        await superagent.head(url, { timeout: 5 * 1000 })
        push(`${url} is up\n`)
      } catch (err) {
        push(`${url} is down\n`)
      }
      done()
    }
  ),
  // Finally, all the results are piped into a file, results.txt
  createWriteStream('results.txt'), // ④
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('All urls have been checked')
  }
)
