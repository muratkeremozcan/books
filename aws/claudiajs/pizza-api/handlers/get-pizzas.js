const listOfPizzas = require('../data/pizzas.json');

function getPizzas(pizzaId, pizzas = listOfPizzas) {

  if (typeof pizzaId === 'undefined') {
    return pizzas;
  }

  const pizza = pizzas.find(pizza => pizza.id == pizzaId);

  if (!pizza) {
    throw 'The pizza you requested was not found';
  }

  return pizza;
}

module.exports = getPizzas;