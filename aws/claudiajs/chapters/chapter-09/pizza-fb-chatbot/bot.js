'use strict'

const botBuilder = require('claudia-bot-builder')

const pizzaDetails = require('./handlers/pizza-details')
const orderPizza = require('./handlers/order-pizza')
const pizzaMenu = require('./handlers/pizza-menu')
const saveLocation = require('./handlers/save-location')
const getLastPizza = require('./handlers/get-last-pizza')
const deliveryWebhook = require('./handlers/delivery-webhook')

const api = botBuilder((message) => {
  if (message.postback) {
    const [action, pizzaId] = message.text.split('|')

    if (action === 'DETAILS') {
      return pizzaDetails(pizzaId)
    } else if (action === 'ORDER') {
      return orderPizza(pizzaId, message)
    }
  }
  
  if (message.originalRequest.message.attachments &&
      message.originalRequest.message.attachments.length &&
      message.originalRequest.message.attachments[0].payload.coordinates &&
      message.originalRequest.message.attachments[0].payload.coordinates.lat &&
      message.originalRequest.message.attachments[0].payload.coordinates.long) {
    return saveLocation(message.originalRequest.message.attachments[0].payload.coordinates)
  }

  if (message.originalRequest.message.nlp &&
      message.originalRequest.message.nlp.entities &&
      message.originalRequest.message.nlp.entities['thanks'] &&
      message.originalRequest.message.nlp.entities['thanks'].length &&
      message.originalRequest.message.nlp.entities['thanks'][0].confidence > 0.8) { 
    return `You're welcome!`
  }
  
  return getLastPizza(message.sender)
    .then((lastPizza) => {
      let lastPizzaText = lastPizza ? `glad to have you back! Hope you liked your ${lastPizza.name} pizza` : ''
      return [
        `Hello, ${lastPizzaText} here's our pizza menu:`,
        pizzaMenu()
      ]
    })
    
  api.post('/delivery', (request) => deliveryWebhook(request.body, request.env.facebookAccessToken), {
    success: 200,
    error: 400
  })
}, {
  platforms: ['facebook']
})

module.exports = api
