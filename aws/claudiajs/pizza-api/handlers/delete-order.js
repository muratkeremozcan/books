const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require('minimal-request-promise');

/**
 * contact the pizza-orders database table to see if the order has the “pending” status.
 * Cancel it using the DELETE method of the Some Like It Hot Delivery API,
 * and finally delete it from the pizza-orders table.
 */
function deleteOrder(orderId) {
  console.log('Delete an order', orderId);

  return docClient.get({ // get the orderId from the pizza-orders table
    TableName: 'pizza-orders',
    Key: {
      orderId: orderId
    }
  }).promise()
    .then(result => result.Item)
    .then(item => {
      if (item.status !== 'pending')
        throw new Error('Order status is not pending')

      // send a delete request to the some like it hot api
      return rp.delete(`https://some-like-it-hot.effortless-serverless.com/delivery/${orderId}`, {
        headers: {
          Authorization: 'aunt-marias-pizzeria-1234567890',
          'Content-type': 'application/json'
        }
      })
    })
    .then(() =>
      docClient.delete({ // delete the order from pizza-orders table
        TableName: 'pizza-orders',
        Key: {
          orderId: orderId
        }
      }).promise()
      // you can remove the following because the result will be sent directly as an api response
      // ).then(result => {
      //   console.log('Order is deleted', result);
      //   return result;
      // }).
      // catch(deleteError => {
      //   console.log(`Oops, order is not updated :(`, deleteError)
      //   throw deleteError;
      // });
    )
}

module.exports = deleteOrder;
