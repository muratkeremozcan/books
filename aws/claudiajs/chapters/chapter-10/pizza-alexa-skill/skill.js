'use strict'

const AlexaMessageBuilder = require('alexa-message-builder')

function alexaSkill(event, context, callback) {
  if (
    !event ||
    !event.request ||
    ['LaunchRequest', 'IntentRequest', 'SessionEndedRequest'].indexOf(event.request.type) < 0
  ) {
    return callback('Not valid Alexa request')
  }
  
  const message = new AlexaMessageBuilder()
  
  if (
    event.request.type === 'LaunchRequest' ||
    (event.request.type === 'IntentRequest' && event.request.intent.name === 'ListPizzas')
  ) {
    message
      .addText('You can order: Capricciosa, Quattro Formaggi, Napoletana or Margherita. Which one do you want?')
      .keepSession()
  } else if (
    event.request.type === 'IntentRequest' &&
    event.request.intent.name === 'OrderPizza' &&
    ['Capricciosa', 'Quattro Formaggi', 'Napoletana', 'Margherita'].indexOf(event.request.intent.slots.Pizza.value) > -1
  ) {
    const pizza = event.request.intent.slots.Pizza.value

    message
      .addText(`What's the address where your ${pizza} should be delivered?`)
      .addSessionAttribute('pizza', pizza)
      .keepSession()
  } else if (
    event.request.type === 'IntentRequest' &&
    event.request.intent.name === 'DeliveryAddress' &&
    event.request.intent.slots.Address.value
  ) {
    // Save pizza order
    
    message
      .addText(`Thanks for ordering pizza. Your order is processed and pizza should be delivered shortly`)
  } else {
    message
      .addText('Oops, it seems there was a problem, please try again')
  }
  
  callback(null, message.get())
}

exports.handler = alexaSkill
