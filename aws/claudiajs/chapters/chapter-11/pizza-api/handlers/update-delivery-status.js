'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

function updateDeliveryStatus(request) {
  if (!request.deliveryId || !request.status)
    throw new Error('Status and delivery ID are required')

  return docClient.update({
    TableName: 'pizza-orders',
    Key: {
      orderId: request.deliveryId
    },
    UpdateExpression: 'set deliveryStatus = :s',
    ExpressionAttributeValues: {
      ':s': request.status
    }
  }).promise()
    .then(() => {
      return {}
    })
}

module.exports = updateDeliveryStatus
