'use strict'

const botBuilder = require('claudia-bot-builder')
const pizzas = require('./data/pizzas.json')

const pizzaMenu = require('./handlers/pizza-menu'),
  orderPizza = require('./handlers/order-pizza'),
  checkOrderProgress = require('./handlers/check-order-progress'),
  saveAddress = require('./handlers/save-address')


const api = botBuilder((message, originalApiRequest) => {

  let chosenPizza
  pizzas.forEach(pizza => {
    if (message.text.indexOf(pizza.shortCode) != -1) {
      chosenPizza = pizza
    }
  })

  if (chosenPizza) {
    return orderPizza(chosenPizza, message.sender)
  }

  return checkOrderProgress(message.sender)
    .then(orderInProgress => {
      if (orderInProgress) {
        return saveAddress(orderInProgress, message)
      } else {
        return pizzaMenu()
      }
    })
}, {platforms: ['twilio']})

module.exports = api
