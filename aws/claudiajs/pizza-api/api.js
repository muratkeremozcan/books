const Api = require('claudia-api-builder')
const api = new Api()

api.get('/pizzas', () =>  ['Capricciosa', 'Quattro Formaggi', 'Napoletana', 'Margherita']);

module.exports = api;

// to deploy: claudia create --region us-east-1 --api-module api

