const wrap = require('@dazn/lambda-powertools-pattern-basic')
const Log = require('@dazn/lambda-powertools-logger')
const EventBridge = require('@dazn/lambda-powertools-eventbridge-client')

module.exports.handler = wrap(async (event) => {
  await EventBridge.putEvents({
    Entries: [{
      Source: "my.events",
      DetailType: "my.event.type",
      Detail: event.Records[0].Sns.Message
    }]
  }).promise()

  Log.debug('successfully sent event to EventBridge', {
    source: "my.events",
    detailType: "my.event.type",
    detail: event.Records[0].Sns.Message
  })
})