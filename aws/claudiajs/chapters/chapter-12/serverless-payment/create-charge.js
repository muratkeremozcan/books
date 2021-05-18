'use strict'
const paymentRepository = require('./repositories/payment-repository.js')
const orderRepository = require('./repositories/order-repository.js')

module.exports = function (paymentRequest) {
  let paymentDescription = 'Pizza Order payment'

  return paymentRepository.createCharge(paymentRequest.token, paymentRequest.amount, paymentRequest.currency, paymentDescription)
    .then(() => orderRepository.updateOrderStatus(paymentRequest.orderId))
}