const Money = require('./money')

class Portfolio {
  constructor() {
    this.moneys = []
  }

  add(...moneys) {
    this.moneys = this.moneys.concat(moneys)
    return this.moneys
  }

  evaluate(currency) {
    const total = this.moneys.reduce(
      (sum, money) => sum + this.convert(money, currency),
      0
    )
    return new Money(total, currency)
  }

  convert(money, currency) {
    if (money.currency === currency) return money.amount

    // Green (2) make the new test work with had coded value
    // return money.amount * 1.2 // works EUR -> USD
    // return money.amount * 1100 // works USD -> KRW

    // Refactor(3) add code to make things less hard-coded
    const exchangeRates = new Map()
    exchangeRates.set('EUR->USD', 1.2)
    exchangeRates.set('USD->KRW', 1100)

    // return money.amount * exchangeRates.get('EUR->USD') // works for EUR -> USD
    // return money.amount * exchangeRates.get('USD->KRW') // works for USD -> KRW

    // Refactor(4) add code to make things less hard-coded
    const key = money.currency + '->' + currency
    return money.amount * exchangeRates.get(key)
  }
}

module.exports = Portfolio
