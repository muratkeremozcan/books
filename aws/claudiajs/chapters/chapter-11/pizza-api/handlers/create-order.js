'use strict'

const AWS = require('aws-sdk')
const rp = require('minimal-request-promise')

function createOrder(request, tableName) {
  tableName = tableName || 'pizza-orders'

  const docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_DEFAULT_REGION
  })
  let userAddress = request && request.body && request.body.address;
  if (!userAddress) {
    const userData = request && request.context && request.context.authorizer && request.context.authorizer.claims;
    if (!userData)
      throw new Error()
    // console.log('User data', userData)
    userAddress = JSON.parse(userData.address).formatted
  }

  if (!request || !request.body || !request.body.pizza || !userAddress)
    throw new Error('To order pizza please provide pizza type and address where pizza should be delivered')

  return rp.post('https://some-like-it-hot-api.effortlessserverless.com/delivery', {
    headers: {
      Authorization: 'aunt-marias-pizzeria-1234567890',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      pickupTime: '15.34pm',
      pickupAddress: 'Aunt Maria Pizzeria',
      deliveryAddress: userAddress,
      webhookUrl: 'https://g8fhlgccof.execute-api.eu-central-1.amazonaws.com/latest/delivery',
    })
  })
    .then(rawResponse => JSON.parse(rawResponse.body))
    .then(response => {
      return docClient.put({
        TableName: tableName,
        Item: {
          cognitoUsername: userAddress['cognito:username'],
          orderId: response.deliveryId,
          pizza: request.body.pizza,
          address: userAddress,
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
