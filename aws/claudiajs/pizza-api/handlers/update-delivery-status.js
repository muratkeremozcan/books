const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const docClient = new AWS.DynamoDB.DocumentClient();

/** a webhook is a simple API endpoint that accepts POST requests. 
 There are two things you need to do: Create a route handler for the webhook, Create a route called /delivery that accepts POST requests */
function updateDeliveryStatus(request) {
  console.log('Update delivery status', request);

  if (!request.deliveryId || !request.status) {
    throw new Error('Status and delivery ID are required')
  }

  return docClient.update({
    TableName: 'pizza-orders',
    Key: {
      orderId: request.deliveryId // deliveryId as a primary key for the order, because it’s the same as the order ID
    },
    UpdateExpression: 'set deliveryStatus = :s', // Describe how the update will modify attributes of an order
    ExpressionAttributeValues: { // Provide the values to the UpdateExpression expression
      ':s': request.status
    }
  }).promise()
    .then(() => { }); // Return an empty object to the Some Like It Hot Delivery API
}

module.exports = updateDeliveryStatus;
