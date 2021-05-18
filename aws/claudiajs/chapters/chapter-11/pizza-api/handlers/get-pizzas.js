'use strict'

const listOfPizzas = require('../data/pizzas.json')

function getPizzas(pizzaId, pizzas = listOfPizzas) {
  if (typeof pizzaId == null)
    return pizzas

  const pizza = pizzas.find((pizza) => {
    return pizza.id == pizzaId
  })

  if (pizza)
    return pizza

  throw `The pizza you requested was not found`
}

module.exports = getPizzas
