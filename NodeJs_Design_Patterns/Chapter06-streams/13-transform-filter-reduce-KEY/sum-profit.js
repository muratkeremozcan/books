import { Transform } from 'stream'

export class SumProfit extends Transform {
  constructor (options = {}) {
    // objectMode as well, because it will receive objects representing records from the CSV file.
    options.objectMode = true
    super(options)
    this.total = 0
  }

  // It's important to note that this time, we are not calling this.push().
  // This means that no value is emitted while the data is flowing through the stream. 
  // We still need to call cb(), though, to indicate that the current record has been processed and the stream is ready to receive another one.
  _transform (record, enc, cb) {
    this.total += Number.parseFloat(record.profit)
    cb()
  }

  // Pattern: Streaming aggregation 
  // Use _transform() to process the data and accumulate the partial result,
  // then call this.push() only in the _flush() method to emit the result 
  // when all the data has been processed.
  _flush (cb) {
    this.push(this.total.toString())
    cb()
  }
}
