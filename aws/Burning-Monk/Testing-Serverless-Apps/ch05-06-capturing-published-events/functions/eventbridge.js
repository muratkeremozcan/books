const AWS = require('aws-sdk')
const DynamoDBClient = new AWS.DynamoDB.DocumentClient()
const SNSClient = new AWS.SNS()

const { SNS_TOPIC_ARN, DYNAMODB_TABLE } = process.env

/**
 * 
 * @param {import('aws-lambda').EventBridgeEvent} event 
 */
module.exports.handler = async (event) => {
  const { id, message } = event.detail

  await DynamoDBClient.put({
    TableName: DYNAMODB_TABLE,
    Item: {
      id,
      source: event.source,
      message
    }
  }).promise()

  await SNSClient.publish({
    TopicArn: SNS_TOPIC_ARN,
    Message: 'eventbridge function says hello',
    MessageAttributes: {
      id: {
        DataType: 'String',
        StringValue: id
      }
    }
  }).promise()
}
