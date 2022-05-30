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
    // Green (3)
    let failures = []
    const total = this.moneys.reduce((sum, money) => {
      const convertedAmount = this.convert(money, currency)

      if (convertedAmount == null) {
        failures.push(money.currency + '->' + currency)
        return sum
      }

      return sum + convertedAmount
    }, 0)

    if (!failures.length) return new Money(total, currency)

    throw new Error(`Missing exchange rate(s):[${failures.join()}]`)
  }

  convert(money, currency) {
    if (money.currency === currency) return money.amount

    const exchangeRates = new Map()
    exchangeRates.set('EUR->USD', 1.2)
    exchangeRates.set('USD->KRW', 1100)
    const key = money.currency + '->' + currency

    // Red (2)
    const rate = exchangeRates.get(key)
    if (rate == null) return undefined

    return money.amount * rate
  }
}

module.exports = Portfolio
