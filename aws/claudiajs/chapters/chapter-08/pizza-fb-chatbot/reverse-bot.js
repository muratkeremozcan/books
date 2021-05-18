'use strict'

const botBuilder = require('claudia-bot-builder')

const api = botBuilder((message) => {
  return message.text.split('').reverse().join('')
}, {
  platforms: ['facebook']
})

module.exports = api
