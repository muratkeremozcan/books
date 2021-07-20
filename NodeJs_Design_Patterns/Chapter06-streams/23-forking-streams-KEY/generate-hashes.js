import { createReadStream, createWriteStream } from 'fs'
import { createHash } from 'crypto'

// a small utility that outputs both the sha1 and md5 hashes of a given file

const filename = process.argv[2]

// source
const inputStream = createReadStream(filename)

// destination 1
const sha1Stream = createHash('sha1').setEncoding('hex')

// destination 2
const md5Stream = createHash('md5').setEncoding('hex')

inputStream
  .pipe(sha1Stream)
  .pipe(createWriteStream(`${filename}.sha1`))

inputStream
  .pipe(md5Stream)
  .pipe(createWriteStream(`${filename}.md5`))
