const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const { RESTAURANTS_TABLE_NAME } = process.env

/**
 * 
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
module.exports.handler = async (event) => {
  const { searchPhrase } = JSON.parse(event.body)

  // this is for demo only, you should use API Gateway's request validation
  // in a real-world project, see the add-restaurant example
  if (!searchPhrase) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Please specify a search phrase in the POST body.'
      })
    }
  }

  // this is a demo, in practice you should not use DynamoDB
  // scan to implement search features!
  // instead, consider Algolia or some form of hosted Elasticsearch service  

  const result = await DocumentClient.scan({
    TableName: RESTAURANTS_TABLE_NAME,
    FilterExpression: "contains(#name, :searchPhrase)",
    ExpressionAttributeNames: { "#name": 'name' },
    ExpressionAttributeValues: { ":searchPhrase": searchPhrase }
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      restaurants: result.Items
    })
  }
}