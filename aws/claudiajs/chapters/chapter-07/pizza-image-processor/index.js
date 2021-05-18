'use strict'

const convert = require('./convert')

function handlerFunction(event, context, callback) {
  const eventRecord = event.Records && event.Records[0]

  if (eventRecord) {
    if (eventRecord.eventSource === 'aws:s3' && eventRecord.s3) {
      return convert(eventRecord.s3.bucket.name, eventRecord.s3.object.key)
        .then(response => {
          callback(null, response)
        })
        .catch(callback)
    }

    return callback('unsupported event source')
  }

  callback('no records in the event')
}

exports.handler = handlerFunction
