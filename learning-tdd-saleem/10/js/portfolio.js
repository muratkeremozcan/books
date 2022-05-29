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

    const exchangeRates = new Map()
    exchangeRates.set('EUR->USD', 1.2)
    exchangeRates.set('USD->KRW', 1100)

    const key = money.currency + '->' + currency
    return money.amount * exchangeRates.get(key)
  }
}

module.exports = Portfolio
