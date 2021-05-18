'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

function saveAddress(order, message) {

  return docClient.put({
    TableName: 'pizza-orders',
    Key: {
      orderId: order.id
    },
    UpdateExpression: 'set orderStatus = :o, address = :a',
    ExpressionAttributeValues: {
      ':o': 'pending',
      ':a': message.text
    },
    ReturnValues: 'UPDATED_NEW'
  }).promise()
}

module.exports = saveAddress
