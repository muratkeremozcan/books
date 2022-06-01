const Money = require('./money')

class Bank {
  constructor() {
    this.exchangeRates = new Map()
  }
  addExchangeRate(currencyForm, currencyTo, rate) {
    const key = currencyForm + '->' + currencyTo
    return this.exchangeRates.set(key, rate)
  }
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
