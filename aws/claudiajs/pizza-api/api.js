const Api = require('claudia-api-builder')
const api = new Api()

const getPizzas = require('./handlers/get-pizzas')
const getOrders = require('./handlers/get-orders');
const createOrder = require('./handlers/create-order')
const updateOrder = require('./handlers/update-order')
const deleteOrder = require('./handlers/delete-order')
const updateDeliveryStatus = require('./handlers/update-delivery-status');
const getSignedUrl = require('./handlers/generate-presigned-url.js')

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

api.get('/upload-url', () => getSignedUrl(), {
  error: 400
})

module.exports = api;
