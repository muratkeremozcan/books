const DynamoDB = require('aws-sdk/clients/dynamodb')
const DynamoDBClient = new DynamoDB.DocumentClient()

const { DYNAMODB_TABLE } = process.env

/**
 * 
 * @param {import('aws-lambda').SNSEvent} event 
 */
module.exports.handler = async (event) => {
  const record = event.Records[0]
  const message = record.Sns.Message
  const id = record.Sns.MessageAttributes.id.Value

  const getResp = await DynamoDBClient.get({
    TableName: DYNAMODB_TABLE,
    Key: {
      id
    }
  }).promise()

  if (!getResp.Item) {
    console.log(`item is not found in DynamoDB for id [${id}]`)

    return
  }

  await DynamoDBClient.update({
    TableName: DYNAMODB_TABLE,
    UpdateExpression: 'SET ending = :ending',
    Key: {
      id
    },
    ExpressionAttributeValues: {
      ':ending': `${message}, and the sns function says good bye`
    }
  }).promise()
}