'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

function checkProgressOrder(sender) {

  return docClient.scan({
    ExpressionAttributeValues: {':user': sender, ':status': 'in-progress'},
    FilterExpression: 'user = :user and orderStatus = :status',
    Limit: 1,
    TableName: 'pizza-orders'
  }).promise()
    .then((result) => {
      if (result.Items && result.Items.length > 0) {
        return result.Items[0]
      } else {
        return undefined
      }
    })
    .catch((err) => {
      console.log(err)
      return [
        'Oh! Something went wrong. Can you please try again?'
      ]
    })
}

module.exports = checkProgressOrder

