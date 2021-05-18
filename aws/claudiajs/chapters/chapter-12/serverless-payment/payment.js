'use strict'
const ApiBuilder = require('claudia-api-builder')
const api = new ApiBuilder()
const createCharge = require('./create-charge')
const paymentRepository = require('./repositories/payment-repository')

api.post('/create-charge', request => {
  let paymentRequest = {
    token: request.body.stripeToken,
    amount: request.body.amount,
    currency: request.body.currency,
    orderId: request.body.metadata
  }
  return createCharge(paymentRequest)
    .then(charge => {
      return {message: 'Payment Initiated!', charge: charge}
    }).catch(err => {
      return {message: 'Payment Initialization Error', error: err}
    })
})

api.get('/charges', request => {
  return paymentRepository.getAllCharges()
    .catch(err => {
      return {message: 'Charges Listing Error', error: err}
    })
})

module.exports = api