const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function deleteOrder(orderId) {
  if (!orderId) {
    throw new Error('Order ID is required for deleting the order');
  }

  return docClient.delete({
    TableName: 'pizza-orders',
    Key: {
      orderId: orderId
    }
  }).promise()
    .then(result => {
      console.log('Order is deleted', result);
      return result;
    }).
    catch(deleteError => {
      console.log(`Oops, order is not updated :(`, deleteError)
      throw deleteError;
    });
}

module.exports = deleteOrder;
