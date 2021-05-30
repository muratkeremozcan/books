// // in the integration test the intent is to see if successful lambda calls are saving orders to the db
// // we can make mock calls, and still be able to check if real db entries are being created
// // the only thing this is missing from an e2e test is that the lambda isn not being called

// const createOrder = require('../../handlers/create-order');
// // mock http requests
// const fakeHttpRequest = require('fake-http-request'); // nock alternative
// const https = require('https'); // fakeHttpRequest uses it for tracking mocked requests
// const AWS = require('aws-sdk')

// // KEY: an instance of dynamoDb, to create a real dynamoDb table for the integration test later. Remember we did this in ch3
// const dynamoDb = new AWS.DynamoDB({
//   apiVersion: '2012-08-10',
//   region: 'us-east-1'
// });
// // we randomize the table name using a timestamp
// const tableName = `pizzaOrderTest${new Date().getTime()}`;
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // crudding dynamoDB can take time, so we increase the timeout


// describe('Create order (integration)', () => {
//   // you need to create a DynamoDB table before all tests using Jasmine’s beforeAll function.
//   // Keep in mind that the creation of a DynamoDB table is asynchronous, so you’ll need to use the done callback to tell Jasmine when the operation is finished. 

//   // You can use the createTable method from the DynamoDB class for this. 
//   // It needs to have the same key definitions as your pizza-orders table, which means that it needs to have orderId as a hash key. 

//   // Because the createTable promise will resolve before the DynamoDB table is ready, 
//   // ou can use the waitFor method of the AWS SDK’s DynamoDB class to be sure that the table exists before invoking the Jasmine done callback.

//   beforeAll((done) => {
//     // similar to the CLI command in ch3
//     dynamoDb.createTable({
//       AttributeDefinitions: [{
//         AttributeName: 'orderId',
//         AttributeType: 'S'
//       }],
//       KeySchema: [{
//         AttributeName: 'orderId',
//         KeyType: 'HASH'
//       }],
//       ProvisionedThroughput: {
//         ReadCapacityUnits: 1,
//         WriteCapacityUnits: 1
//       },
//       TableName: tableName
//     }).promise()
//       .then(() => dynamoDb.waitFor('tableExists', {
//         TableName: tableName
//       }).promise())
//       .then(done)
//       .catch(done.fail)
//   });

//   afterAll((done) => {
//     dynamoDb.deleteTable({
//       TableName: tableName
//     }).promise()
//       .then(() => dynamoDb.waitFor('tableNotExists', {
//         TableName: tableName
//       }).promise())
//       .then(done)
//       .catch(done.fail)
//   });

//   beforeEach(() => fakeHttpRequest.install({ // needed to use the fakeHttpRequest module
//     type: 'https',
//     matcher: /some-like-it-hot/ // this time it is only for the some-like-it-hot api
//   }));

//   afterEach(() => fakeHttpRequest.uninstall('https'));

//   it('should save the order in the DynamoDB table if Some Like It Hot delivery API request was successful', (done) => {
//     https.request.pipe(() => https.request.calls[0].respond(200, 'Ok', JSON.stringify({
//       deliveryId: 'order-id-from-delivery-api'
//     })));

//     createOrder({ pizza: 1, address: '221b Baker Street' }, tableName)
//       .then(rawResponse => JSON.parse(rawResponse.body))
//       .then(response => {
//         dynamoDb.getItem({
//           Key: {
//             orderId: {
//               S: response.deliveryId
//             }
//           },
//           TableName: tableName
//         }).promise()
//           .then(result => {
//             console.log(result)
//             expect(result.Item.orderId.S).toBe(response.deliveryId)
//             expect(result.Item.address.S).toBe('221b Baker Street')
//             expect(result.Item.pizza.N).toBe('1')
//             done()
//           }).catch(done.fail)
//       }).catch(done.fail)

//     https.request.pipe(() => https.request.calls[0].respond(200, 'Ok', JSON.stringify({
//       deliveryId: 'order-id-from-delivery-api'
//     })));
//   });
// });