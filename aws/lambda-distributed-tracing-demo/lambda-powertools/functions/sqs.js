const wrap = require('@dazn/lambda-powertools-pattern-basic')
const Log = require('@dazn/lambda-powertools-logger')
const SNS = require('@dazn/lambda-powertools-sns-client')

const TopicArn = process.env.TOPIC_ARN

module.exports.handler = wrap(async (event, context) => {
  Log.debug('received SQS events', { count: event.Records.length })

  await Promise.all(event.Records.map(async record => {
    // each SQS record has a `logger` attached to it, with the correlation IDs
    // specific for that record
    await SNS.publishWithCorrelationIds(
      record.correlationIds,
      {
        TopicArn,
        Message: record.body
      }).promise()
  
    record.logger.debug('successfully sent message to SNS', {
      topicArn: TopicArn,
      message: record.body
    })
  }))
})