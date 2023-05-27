const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const restaurant_exists_in_dynamodb = async (id) => {
  const getRes = await DocumentClient.get({
    TableName: process.env.RESTAURANTS_TABLE_NAME,
    Key: {
      id
    }
  }).promise()

  const restaurant = getRes.Item
  expect(restaurant).not.toBeNull()

  return restaurant
}

module.exports = {
  restaurant_exists_in_dynamodb
}