'use strict'

const pizzas = require('../data/pizzas.json')
const fbTemplate = require('claudia-bot-builder').fbTemplate

function pizzaMenu() {
  const message = new fbTemplate.Generic()

  pizzas.forEach(pizza => {
    message.addBubble(pizza.name)
      .addImage(pizza.image)
      .addButton('Details', `DETAILS|${pizza.id}`)
      .addButton('Order', `ORDER|${pizza.id}`)
  })

  return message.get()
}

module.exports = pizzaMenu
