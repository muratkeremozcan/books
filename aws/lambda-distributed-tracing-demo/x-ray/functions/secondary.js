const XRay = require('aws-xray-sdk-core')
const AWS = XRay.captureAWS(require('aws-sdk'))
const SQS = new AWS.SQS()

const QueueUrl = process.env.QUEUE_URL

module.exports.handler = async (event) => {
  await SQS.sendMessage({
    QueueUrl,
    MessageBody: event.body
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({})    
  }
}