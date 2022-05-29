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
    const total = this.moneys.reduce(
      (sum, money) => sum + this.convert(money, currency),
      0
    )
    return new Money(total, currency)
  }

  convert(money, currency) {
    if (money.currency === currency) return money.amount

    // return money.amount * 1.2
    // return money.amount * 1100

    const exchangeRates = new Map()
    exchangeRates.set('EUR->USD', 1.2)
    exchangeRates.set('USD->KRW', 1100)

    // return money.amount * exchangeRates.get('EUR->USD')
    // return money.amount * exchangeRates.get('USD->KRW')

    const key = `${money.currency}->${currency}`
    return money.amount * exchangeRates.get(key)
  }
}
