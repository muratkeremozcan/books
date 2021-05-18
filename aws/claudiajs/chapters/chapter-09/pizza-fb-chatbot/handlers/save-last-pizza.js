'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const pizzaMenu = require('./pizza-menu')
const pizzas = require('../data/pizzas.json')

function getLastPizza(sender) {

  return docClient.scan({
    TableName: 'pizza-orders',
    ScanIndexForward: false,
    Limit: 1,
    FilterExpression: `sender = #{sender}`,
  }).promise()
    .then((lastPizzaOrder) => {
      let lastPizza
      if (lastPizzaOrder){
        lastPizza = pizzas.find(pizza => pizza.id == lastPizzaOrder.pizzaId)
      }
      return lastPizza
    })
    .catch((err) => {
      console.log(err)
      return [
        'Oh! Something went wrong. Can you please try again?',
        pizzaMenu()
      ]
    })
}

module.exports = getLastPizza
