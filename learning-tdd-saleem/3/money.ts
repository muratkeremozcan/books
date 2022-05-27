export class Money {
  constructor(public amount: number, public currency: string) {}

  times(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency)
  }

  divide(divisor: number): Money {
    return new Money(this.amount / divisor, this.currency)
  }
}

export class Portfolio {
  moneys: Money[]
  constructor() {
    this.moneys = []
  }

  add(...moneys: Money[]): Money[] {
    return (this.moneys = this.moneys.concat(...moneys))
  }

  evaluate(currency: string): Money {
    const total = this.moneys.reduce((sum, money) => sum + money.amount, 0)
    return new Money(total, currency)
  }
}

export class PortfolioPure {
  constructor(public portfolioItems: Money[]) {}

  evaluate(currency: string): Money {
    const total = this.portfolioItems.reduce(
      (sum, item) => sum + item.amount,
      0
    )
    return new Money(total, currency)
  }
}
