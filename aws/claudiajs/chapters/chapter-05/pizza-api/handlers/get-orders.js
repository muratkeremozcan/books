'use strict'

const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()

function getOrders(orderId) {
  if (typeof orderId === 'undefined')
    return docClient.scan({
      TableName: 'pizza-orders'
    }).promise()
      .then(result => result.Items)

  return docClient.get({
    TableName: 'pizza-orders',
    Key: {
      orderId: orderId
    }
  }).promise()
    .then(result => result.Item)
    .catch(getError => {
      console.log(getError)
      throw `Order with ID ${orderId} was not found`
    })
}

module.exports = getOrders
