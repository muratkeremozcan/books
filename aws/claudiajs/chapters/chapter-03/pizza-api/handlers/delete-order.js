'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

function deleteOrder(orderId) {
  return docClient.delete({
    TableName: 'pizza-orders',
    Key: {
      orderId: orderId
    }
  }).promise()
    .then((result) => {
      console.log('Order is deleted!', result)
      return result
    })
    .catch((deleteError) => {
      console.log(`Oops, order is not deleted :(`, deleteError)
      throw deleteError
    })
}

module.exports = deleteOrder
