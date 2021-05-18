'use strict'

const pizzas = require('../data/pizzas.json')
const fbTemplate = require('claudia-bot-builder').fbTemplate

function pizzaDetails(id) {
  const pizza = pizzas.find(pizza => pizza.id == id)
      
  return [
    `${pizza.name} has following ingredients: ` + pizza.ingredients.join(', '),
    new fbTemplate.Button('What else can I do for you?')
      .addButton('Order', `ORDER|${pizza.id}`)
      .addButton('Show all pizzas', 'ALL_PIZZAS')
      .get()
  ]
}

module.exports = pizzaDetails
