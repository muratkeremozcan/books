const AWS = require('aws-sdk')
const DynamoDB = AWS.DynamoDB
const EventBridgeClient = new AWS.EventBridge()
const uuid = require('uuid')

const { EVENT_BUS } = process.env

/**
 * 
 * @param {import('aws-lambda').DynamoDBStreamEvent} event 
 */
module.exports.handler = async (event) => {
  for (const record of event.Records) {
    let detailType, message

    if (record.eventName === 'INSERT') {
      DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
      detailType = 'greeting'
      message = `dynamodb function says hello`
    } else if (record.eventName === 'MODIFY') {
      DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
      detailType = 'greeting'
      message = `dynamodb function says hello, again`
    } else {
      DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
      detailType = 'bye'
      message = `dynamodb function says good bye`
    }

    await EventBridgeClient.putEvents({
      Entries: [{
        EventBusName: EVENT_BUS,
        Source: 'dynamodb-function',
        DetailType: detailType,
        Detail: JSON.stringify({
          id: uuid.v4(),
          message
        })
      }]
    }).promise()
  }
}