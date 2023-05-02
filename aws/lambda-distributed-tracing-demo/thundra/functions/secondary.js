const AWS = require('aws-sdk')
const SQS = new AWS.SQS()
const thundra = require("@thundra/core")()

const QueueUrl = process.env.QUEUE_URL

module.exports.handler = thundra(async (event) => {
  await SQS.sendMessage({
    QueueUrl,
    MessageBody: event.body
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({})    
  }
})
