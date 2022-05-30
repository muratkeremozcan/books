const Money = require('./money')

class Portfolio {
  constructor() {
    this.moneys = []
  }

  add(...moneys) {
    this.moneys = this.moneys.concat(moneys)
    return this.moneys
  }

  // Refactor (5) we want portfolio.evaluate to use Bank with Dependency Injection
  // and we want convert to come from Bank
  evaluate(bank, currency) {
    let failures = []
    const total = this.moneys.reduce((sum, money) => {
      try {
        const convertedAmount = bank.convert(money, currency)
        return sum + convertedAmount.amount
      } catch (error) {
        failures.push(money.currency + '->' + currency)
        return sum
      }
    }, 0)

    if (!failures.length) return new Money(total, currency)

    throw new Error(`Missing exchange rate(s):[${failures.join()}]`)
  }
}

module.exports = Portfolio
