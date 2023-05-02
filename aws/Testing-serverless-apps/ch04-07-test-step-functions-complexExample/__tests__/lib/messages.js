const SQS = require('aws-sdk/clients/sqs')
const { ReplaySubject } = require("rxjs")
const { take, filter } = require("rxjs/operators")
const _ = require('lodash')

const messages = new ReplaySubject(100)
const messageIds = new Set()
let pollingLoop
let stop = false

const startListening = () => {
  stop = false

  if (pollingLoop) {
    return
  }

  const sqs = new SQS()
  const queueUrl = process.env.E2eTestQueueUrl
  const loop = async () => {
    if (stop) {
      return
    }

    const resp = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20
    }).promise()

    if (!resp.Messages) {
      return await loop()
    }

    resp.Messages.forEach(msg => {
      if (messageIds.has(msg.MessageId)) {
        // seen this message already, ignore
        return
      }
    
      messageIds.add(msg.MessageId)
    
      const body = JSON.parse(msg.Body)
      // see __tests__/data/notify_restaurant_sqs_body.json for example
      // of what the SQS message should look like
      messages.next({
        topicArn: body.TopicArn,
        message: body.Message
      })
    })

    await loop()
  }

  pollingLoop = loop()
}

const stopListening = () => {
  stop = true
}

const messageContaining = (actual, expected) => {
  const actualObj = JSON.parse(actual)
  return _.isMatch(actualObj, expected)
}

const waitForMessage = (topicArn, message) => {
  return messages
    .pipe(
        filter(incomingMessage => incomingMessage.topicArn === topicArn),
        filter(incomingMessage => messageContaining(incomingMessage.message, message)),
        take(1)
    ).toPromise()
}

module.exports = {
  startListening,
  stopListening,
  waitForMessage
}