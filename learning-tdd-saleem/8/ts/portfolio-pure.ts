import Money from './money'

export default class PortfolioPure {
  constructor(public portfolioItems: Money[]) {}

  evaluate(currency: string): Money {
    const total = this.portfolioItems.reduce(
      (sum, item) => sum + item.amount,
      0
    )
    return new Money(total, currency)
  }
}
