'use strict'

const pizzas = require('./data/pizzas.json')

const botBuilder = require('claudia-bot-builder')
const fbTemplate = botBuilder.fbTemplate

const api = botBuilder(() => {
  const message = new fbTemplate.Generic()
  
  pizzas.forEach(pizza => {
    message.addBubble(pizza.name)
      .addImage(pizza.image)
      .addButton('Details', pizza.id)
  })
  
  return [
    `Hello, here's our pizza menu:`,
    message.get()
  ]
}, {
  platforms: ['facebook']
})

module.exports = api
