import { PassThrough } from 'stream'

// If we want to observe how much data is flowing through one or more streams, 
// we could do so by attaching a data event listener to a PassThrough instance 
// and then piping this instance in a given point of a stream pipeline

let bytesWritten = 0
const monitor = new PassThrough()
monitor.on('data', (chunk) => {
  bytesWritten += chunk.length
})
monitor.on('finish', () => {
  console.log(`${bytesWritten} bytes written`)
})

monitor.write('Hello!')
monitor.end()


/* another monitor example
createReadStream(filename)
  .pipe(createGzip())
  .pipe(monitor)
  .pipe(createWriteStream(`${filename}.gz`))
*/
