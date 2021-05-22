// The easiest way to communicate with DynamoDB from Node is to use the aws-sdk and DocumentClient class
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuid } = require('uuid');

function saveOrder(request) {
  if (!request || !request.pizza || !request.address) {
    throw new Error('To order pizza please provide pizza type and address where pizza should be delivered')
  }

  return docClient.put({
    TableName: 'pizza-orders',
    Item: {
      orderId: uuid(),
      pizza: request.pizza,
      address: request.address,
      status: 'pending'
    }
  }).promise()
    .then(res => { // DocumentClient has a .promise method that returns a promise
      console.log('Order is saved', res);
      return res;
    }).catch(saveError => {
      console.log(`Oops, order is not saved :(`, saveError);
      throw saveError;
    });
}

module.exports = saveOrder;