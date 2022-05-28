const Money = require('./money')

class Portfolio {
  constructor() {
    this.moneys = []
  }

  add(...moneys) {
    this.moneys = this.moneys.concat(moneys)
  }

  evaluate(currency) {
    const total = this.moneys.reduce((sum, money) => sum + money.amount, 0)
    return new Money(total, currency)
  }
}

module.exports = Portfolio
