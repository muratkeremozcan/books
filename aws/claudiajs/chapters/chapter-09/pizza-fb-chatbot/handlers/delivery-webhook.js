'use strict'

const reply = require('claudia-bot-builder/lib/facebook/reply')

function deliveryWebhook(request, facebookAccessToken) {
  if (!request.deliveryId || !request.status)
    throw new Error('Status and delivery ID are required')
    
  return docClient.scan({
    TableName: 'pizza-orders',
    Limit: 1,
    FilterExpression: `deliveryId = :d`,
    ExpressionAttributeValues: {
      ':d': { S: request.deliveryId }
    }
  }).promise()
    .then((result) => result.Items[0])
    .then((order) => {
      return docClient.update({
        TableName: 'pizza-orders',
        Key: {
          orderId: order.orderId
        },
        UpdateExpression: 'set orderStatus = :s',
        ExpressionAttributeValues: {
          ':s': request.status
        },
        ReturnValues: 'ALL_NEW'
      }).promise()
    })
    .then((order) => {
      return reply(order.user, `The status of your delivery is updated to: ${order.status}.`, facebookAccessToken)
    })
}

module.exports = deliveryWebhook
