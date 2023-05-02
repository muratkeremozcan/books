const wrap = require('@dazn/lambda-powertools-pattern-basic')
const Log = require('@dazn/lambda-powertools-logger')
const SQS = require('@dazn/lambda-powertools-sqs-client')

const QueueUrl = process.env.QUEUE_URL

module.exports.handler = wrap(async (event) => {
  await SQS.sendMessage({
    QueueUrl,
    MessageBody: event.body
  }).promise()

  Log.debug('successfully sent message to SQS', { 
    queueUrl: QueueUrl, 
    message: event.body 
  })

  return {
    statusCode: 200,
    body: JSON.stringify({})    
  }
})