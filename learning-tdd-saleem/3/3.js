const assert = require('assert')

class Money {
  constructor(amount, currency) {
    this.amount = amount
    this.currency = currency
  }

  times(multiplier) {
    return new Money(this.amount * multiplier, this.currency)
  }

  divide(divisor) {
    return new Money(this.amount / divisor, this.currency)
  }
}

// Green (2) declare the entity
class Portfolio {
  constructor() {
    // Green (11) need an array to reduce
    this.moneys = []
  }

  // Green (4) add the new method
  add(...moneys) {
    // Green (13) allow our array to be built with multiple moneys
    this.moneys = this.moneys.concat(moneys)
  }

  // Green (6) add the new method
  evaluate(currency) {
    // Green (8) make the assertion work with a hardcoded value
    // return new Money(15, 'USD')
    // Refactor (9) use an arg for currency
    // return new Money(15, currency)
    // Red (10) now need a way to sum up the amounts in the moneys
    const total = this.moneys.reduce((sum, money) => sum + money.amount, 0) //?
    // Red (12) our array is empty, we need a way to keep building it with new moneys
    return new Money(total, currency) //?
  }
}

// [1]
const fiveDollars = new Money(5, 'USD')
const tenDollars = fiveDollars.times(2)
assert.strictEqual(tenDollars.amount, 10)
assert.deepStrictEqual(fiveDollars.times(2), tenDollars)

// [2]
const tenEuros = new Money(10, 'EUR')

assert.strictEqual(twentyEuros.amount, 20)
assert.strictEqual(twentyEuros.currency, 'EUR')

const originalMoney = new Money(4002, 'KRW')
const actualMoneyAfterDivision = originalMoney.divide(4) //?
const expectedMoneyAfterDivision = new Money(1000.5, 'KRW') //?
assert.deepStrictEqual(actualMoneyAfterDivision, expectedMoneyAfterDivision)

// [3]
const fifteenDollars = new Money(15, 'USD') //?
// Red (1) declare a new entity
const portfolio = new Portfolio()
// Red (3) propose a new method for the entity
portfolio.add(fiveDollars, tenDollars) //?
// Red (5) declare a new method for the entity
portfolio.evaluate('USD') //?
// Red (7) assert
assert.deepStrictEqual(portfolio.evaluate('USD'), fifteenDollars)
