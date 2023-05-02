const wrap = require('@dazn/lambda-powertools-pattern-basic')
const Log = require('@dazn/lambda-powertools-logger')
const Kinesis = require('@dazn/lambda-powertools-kinesis-client')

const StreamName = process.env.STREAM_NAME

module.exports.handler = wrap(async (event) => {
  await Kinesis.putRecord({
    StreamName,
    PartitionKey: "test",
    Data: JSON.stringify(event.detail)
  }).promise()

  Log.debug("successfully published record to Kinesis", {
    streamName: StreamName,
    data: event.detail
  })
})