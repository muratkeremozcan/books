'use strict'

const pizzas = require('../data/pizzas.json')

function pizzaMenu() {
  let greeting = `Hello from Aunt Maria's pizzeria!
  Would you like to order a pizza?
  This is our menu:`

  pizzas.forEach(pizza => {
    greeting += `\n - ${pizza.name} to order reply with ${pizza.shortCode}`
  })

  return greeting
}

module.exports = pizzaMenu
