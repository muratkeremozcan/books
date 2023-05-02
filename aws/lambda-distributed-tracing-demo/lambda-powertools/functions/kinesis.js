const wrap = require('@dazn/lambda-powertools-pattern-basic')
const Log = require('@dazn/lambda-powertools-logger')

module.exports.handler = wrap(async (event, context) => {
  const events = context.parsedKinesisEvents
  Log.debug('received Kinesis events', { count: events.length })

  await Promise.all(events.map(async evt => {
    // each parsed kinesis event has a `logger` attached to it, with 
    // the correlation IDs specific for that record
    evt.logger.debug('processed kinesis event', {
      event: evt
    })    
  }))
})
