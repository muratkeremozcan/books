import Money from './money'
import Bank from './bank'
import type { Currency } from './bank'

export default class Portfolio {
  moneys: Money[]
  constructor() {
    this.moneys = []
  }

  add(...moneys: Money[]): Money[] {
    return (this.moneys = this.moneys.concat(...moneys))
  }

  evaluate(bank: Bank, currency: Currency) {
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
