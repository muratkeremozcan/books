const assert = require('assert')

class Money {
  // Red (2) add a new member
  constructor(amount, currency) {
    this.amount = amount
    this.currency = currency
  }

  times(multiplier) {
    // Green (3) add the new argument
    return new Money(this.amount * multiplier, this.currency)
  }

  // Green (5) add the new method
  divide(divisor) {
    // Green (7) add the code that makes the test pass
    return new Money(this.amount / divisor, this.currency)
  }
}

// [1]
let fiveDollars = new Money(5, 'USD')
let tenDollars = fiveDollars.times(2)
assert.strictEqual(tenDollars.amount, 10)
assert.deepStrictEqual(fiveDollars.times(2), tenDollars)

// [2]
let tenEuros = new Money(10, 'EUR')
let twentyEuros = tenEuros.times(2)
assert.strictEqual(twentyEuros.amount, 20)
// Red (1) add a failing test
assert.strictEqual(twentyEuros.currency, 'EUR')

// [3]
let originalMoney = new Money(4002, 'KRW')
// Red (4) add a failing test with new method
let actualMoneyAfterDivision = originalMoney.divide(4)
let expectedMoneyAfterDivision = new Money(1000.5, 'KRW')
// Red (6) add a failing assertion
assert.deepStrictEqual(actualMoneyAfterDivision, expectedMoneyAfterDivision)
