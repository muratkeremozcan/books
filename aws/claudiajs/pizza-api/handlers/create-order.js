// The easiest way to communicate with DynamoDB from Node is to use the aws-sdk and DocumentClient class

// const AWSXRay = require('aws-xray-sdk-core'); // To be able to see other AWS services supported by X-Ray, you’ll need to wrap the AWS SDK for Node.js in the aws-xray-sdk-core module.
// const AWS = AWSXRay.captureAWS(require('aws-sdk')); // wrap the aws-sdk module in the AWSXRay.captureAWS command

const AWS = require('aws-sdk');
const rp = require('minimal-request-promise'); // minimal promise based api for http requests

/** needs to send a POST request to the Some Like It Hot Delivery API, wait for its response, and then save the pizza order to the database.
 * But you need to add a delivery ID to the database, so you can update the status of the order when your webhook receives the data.
*/
function createOrder(request, tableName = 'pizza-orders') {
  // console.log('Save an order', request); // log the request with a prefix text for CloudWatch logs

  const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
  });

  if (!request || !request.pizza || !request.address) {
    throw new Error('To order pizza please provide pizza type and address where pizza should be delivered')
  }

  // The most important feature of the Some Like It Hot Delivery API is its POST /delivery route, which creates a delivery request.
  // This API endpoint accepts the following parameters: 
  // * pickupTime —The pickup time for the order. If the time isn’t provided, the order will be picked up as soon as possible.
  // * pickupAddress —The pickup address for the order. By default, it’ll use the address from your account.
  // * deliveryAddress —The delivery address for the order. 
  // * webhookUrl —The URL for a webhook that should be called to update the delivery status. 
  // The Some Like It Hot Delivery API returns the 
  // * delivery ID, 
  // * the initial delivery status, which is “pending.” 
  // * the pickup time for the order,
  // When the order is picked up, the Some Like It Hot Delivery API needs to make a POST request to your Pizza API webhook and send the 
  // * the delivery ID
  // * new delivery status “in-progress”

  return rp.post('https://some-like-it-hot.effortless-serverless.com/delivery', {
    headers: {
      Authorization: 'aunt-marias-pizzeria-1234567890', // Making a request to an external service usually requires some kind of authorization, but because the Some Like It Hot Delivery API is not a real API, anything you pass in the Authorization header will work.
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ // Request body needs to be stringified because the minimal-request-promise module expects a string
      pickupTime: '15.34pm',
      pickupAddress: 'Aunt Maria Pizzeria',
      deliveryAddress: request.address,
      webhookUrl: 'https://2afo7guwib.execute-api.us-east-1.amazonaws.com/latest/delivery' // The URL for a webhook that should be called to update the delivery status
    })
  })
    .then(rawResponse => JSON.parse(rawResponse.body)) // Parse the response body, because it’s returned as a string
    .then(response =>
      docClient.put({ // Save the data to the DynamoDB table
        TableName: tableName,
        Item: {
          cognitoUsername: request.address['cognito:username'],
          orderId: response.deliveryId, // Because the delivery ID is unique, you can use it instead of generating a new one with the uuid module
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
        }));
}

module.exports = createOrder;