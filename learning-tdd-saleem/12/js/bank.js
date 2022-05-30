const Money = require('./money')

/** Serves as an abstraction for the 2 things Portfolio.convert did: exchangeRates and conversion */
class Bank {
  // Green (2) add method & property for the feature we want (addExchangeRate)
  constructor() {
    this.exchangeRates = new Map()
  }
  addExchangeRate(currencyForm, currencyTo, rate) {
    const key = currencyForm + '->' + currencyTo
    return this.exchangeRates.set(key, rate)
  }
  // Green(4) add a method for the feature we want
  // a refactor of convert which returns Money instead of number
  // with the exchangeRates Map decoupled to the constructor
  convert(money, currency) {
    if (money.currency === currency) {
      return new Money(money.amount, money.currency)
    }

    const key = money.currency + '->' + currency
    const rate = this.exchangeRates.get(key)

    if (rate == null) throw new Error(`Missing exchange rate: ${key}`)
    return new Money(money.amount * rate, currency)
  }
}

module.exports = Bank
