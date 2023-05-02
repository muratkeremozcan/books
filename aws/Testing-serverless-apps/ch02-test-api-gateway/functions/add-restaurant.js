const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const chance = require('chance').Chance()

const { RESTAURANTS_TABLE_NAME } = process.env

/**
 * 
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const newRestaurant = JSON.parse(event.body)
  // do some validation on payload, etc.

  newRestaurant.id = chance.guid()
  await DocumentClient.put({
    TableName: RESTAURANTS_TABLE_NAME,
    Item: newRestaurant
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(newRestaurant)
  }
}