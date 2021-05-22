const Api = require('claudia-api-builder')
const api = new Api()

const getPizzas = require('./handlers/get-pizzas')
const getOrders = require('./handlers/get-orders');
const createOrder = require('./handlers/create-order')
const updateOrder = require('./handlers/update-order')
const deleteOrder = require('./handlers/delete-order')
const updateDeliveryStatus = require('./handlers/update-delivery-status');

api.get('/', () => 'Welcome to Pizza API');

api.get('/pizzas', () => getPizzas());

api.get('/pizzas/{id}', request => getPizzas(request.pathParams.id), {
  error: 404
});

api.get('/orders', () => getOrders(), {
  error: 400
});

api.get('/orders/{id}', request => getOrders(request.pathParams.id), {
  error: 400
})

api.post('/orders', request => createOrder(request.body), {
  success: 201,
  error: 400
});

api.put('/orders/{id}', request => updateOrder(request.pathParams.id, request.body), {
  error: 400
});

api.delete('/orders/{id}', request => deleteOrder(request.pathParams.id), {
  error: 400
});

api.post('/delivery', request => updateDeliveryStatus(request.body), {
  error: 400
})

module.exports = api;

// to deploy: claudia create --region us-east-1 --api-module api
// to update: claudia update --cache-api-config apiConfig
// to test: https://2afo7guwib.execute-api.us-east-1.amazonaws.com/latest/pizzas

/*
created a user with very high policies:
IAMFullAccess
AmazonS3FullAccess
AmazonAPIGatewayPushToCloudWatchLogs
AmazonDynamoDBFullAccess
AmazonAPIGatewayAdministrator
AWSCodeDeployRoleForCloudFormation
AWSCloudFormationFullAccess
AWSLambda_FullAccess
claudia (custom policy)

the custom policy is saved in the root as customPolicyForAws.json

after the deploy the response is

{
  "lambda": {
    "role": "pizza-api-executor",
    "name": "pizza-api",
    "region": "us-east-1"
  },
  "api": {
    "id": "2afo7guwib",
    "module": "api",
    "url": "https://2afo7guwib.execute-api.us-east-1.amazonaws.com/latest"
  }
}

*/
