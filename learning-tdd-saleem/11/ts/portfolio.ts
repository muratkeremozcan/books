import Money from './money'

export default class Portfolio {
  moneys: Money[]
  constructor() {
    this.moneys = []
  }

  add(...moneys: Money[]): Money[] {
    return (this.moneys = this.moneys.concat(...moneys))
  }

  evaluate(currency: string): Money {
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

  convert(money, currency): number {
    if (money.currency === currency) return money.amount

    const exchangeRates = new Map()
    exchangeRates.set('EUR->USD', 1.2)
    exchangeRates.set('USD->KRW', 1100)

    const key = `${money.currency}->${currency}`
    const rate = exchangeRates.get(key)

    if (rate == null) return undefined
    return money.amount * rate
  }
}
