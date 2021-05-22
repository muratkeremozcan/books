const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function getOrders(orderId) {
  if (typeof orderId === 'undefined') {
    return docClient.scan({
      TableName: 'pizza-orders'
    }).promise()
      .then(result => result.Items)
  }

  return docClient.get({
    TableName: 'pizza-orders',
    Key: { // the get method requires a primary key, in this case orderId
      orderId: orderId
    }
  }).promise()
    .then(result => result.Item)
}

module.exports = getOrders;