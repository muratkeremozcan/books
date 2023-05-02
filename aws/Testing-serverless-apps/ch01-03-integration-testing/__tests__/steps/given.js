const AWS = require('aws-sdk')
const DocumentClient = new AWS.DynamoDB.DocumentClient()

const { CARTS_TABLE } = process.env

const user_has_a_cart = async (userId, items) => {
  await DocumentClient.put({
    TableName: CARTS_TABLE,
    Item: {
      userId,
      items: items || []
    }
  }).promise()
}

module.exports = {
  user_has_a_cart
}