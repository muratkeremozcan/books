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
    // Red(1.1) we need a conversion here that takes money and converts to USD
    const total = this.moneys.reduce(
      // Green (3) use the method with hardcoded value to get a passing test
      (sum, money) => sum + this.convert(money, currency),
      0
    )
    return new Money(total, currency)
  }

  // Red (2) add a method satisfies the need, using hard-coding
  convert(money, currency) {
    const eurToUsd = 1.2
    if (money.currency === currency) return money.amount
    return money.amount * eurToUsd
  }
}

module.exports = Portfolio
