export default class Money {
  constructor(public amount: number, public currency: string) {}

  times(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency)
  }

  divide(divisor: number): Money {
    return new Money(this.amount / divisor, this.currency)
  }
}
