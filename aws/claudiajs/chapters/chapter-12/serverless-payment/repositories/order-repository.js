'use strict'
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

module.exports = {
  updateOrderStatus: function (orderId) {
    return docClient.put({
      TableName: 'pizza-orders',
      Key: {
        orderId: orderId
      },
      UpdateExpression: 'set orderStatus = :s',
      ExpressionAttributeValues: {
        ':s': 'paid'
      }
    }).promise()
  }
}