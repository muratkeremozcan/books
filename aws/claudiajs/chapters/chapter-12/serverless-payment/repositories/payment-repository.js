'use strict'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  createCharge: function (stripeToken, amount, currency, description) {
    return stripe.charges.create({
      source: stripeToken,
      amount: amount,
      currency: currency,
      description: description
    })
  },
  getAllCharges: function () {
    return stripe.charges.list()
      .then(response => response.data)
  }
}