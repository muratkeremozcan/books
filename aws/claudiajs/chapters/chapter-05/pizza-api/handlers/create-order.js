'use strict'

const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const rp = require('minimal-request-promise')

function createOrder(request) {
  console.log('Save an order', request)

  if (!request || !request.pizza || !request.address)
    throw new Error('To order pizza please provide pizza type and address where pizza should be delivered')

  return rp.post('https://fake-delivery-api.effortlessserverless.com/delivery', {
    headers: {
      Authorization: 'aunt-marias-pizzeria-1234567890',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      pickupTime: '15.34pm',
      pickupAddress: 'Aunt Maria Pizzeria',
      deliveryAddress: request.address,
      webhookUrl: 'https://g8fhlgccof.execute-api.eu-central-1.amazonaws.com/latest/delivery',
    })
  })
    .then(rawResponse => JSON.parse(rawResponse.body))
    .then(response => {
      return docClient.put({
        TableName: 'pizza-orders',
        Item: {
          orderId: response.deliveryId,
          pizza: request.pizza,
          address: request.address,
          orderStatus: 'pending'
        }
      }).promise()
    })
    .then(res => {
      console.log('Order is saved!', res)

      return res
    })
    .catch(saveError => {
      console.log(`Oops, order is not saved :(`, saveError)

      throw saveError
    })
}

module.exports = createOrder
