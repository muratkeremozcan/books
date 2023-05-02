const AWS = require('aws-sdk')
const Kinesis = new AWS.Kinesis()

const StreamName = process.env.STREAM_NAME

module.exports.handler = async (event) => {
  console.log(JSON.stringify(event))

  await Kinesis.putRecord({
    StreamName,
    PartitionKey: "test",
    Data: JSON.stringify(event.detail)
  }).promise()
}