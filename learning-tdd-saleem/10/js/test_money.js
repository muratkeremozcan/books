const assert = require('assert')
const Money = require('./money')
const Portfolio = require('./portfolio')

class MoneyTest {
  testMultiplication() {
    const tenEuros = new Money(10, 'EUR')
    const twentyEuros = new Money(20, 'EUR')
    assert.deepStrictEqual(tenEuros.times(2), twentyEuros)
  }

  testDivision() {
    const originalMoney = new Money(4002, 'KRW')
    const actualMoneyAfterDivision = originalMoney.divide(4)
    const expectedMoneyAfterDivision = new Money(1000.5, 'KRW')
    assert.deepStrictEqual(actualMoneyAfterDivision, expectedMoneyAfterDivision)
  }

  testAddition() {
    const fiveDollars = new Money(5, 'USD')
    const tenDollars = new Money(10, 'USD')
    const fifteenDollars = new Money(15, 'USD')
    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenDollars)
    assert.deepStrictEqual(portfolio.evaluate('USD'), fifteenDollars)
  }

  testAdditionOfDollarsAndEuros() {
    const fiveDollars = new Money(5, 'USD')
    const tenEuros = new Money(10, 'EUR')
    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenEuros)
    const expectedValue = new Money(17, 'USD')
    assert.deepStrictEqual(portfolio.evaluate('USD'), expectedValue)
  }

  testAdditionOfDollarsAndWons() {
    const oneDollar = new Money(1, 'USD')
    const elevenHundredWon = new Money(1100, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, elevenHundredWon)
    const expectedValue = new Money(2200, 'KRW')
    assert.deepStrictEqual(portfolio.evaluate('KRW'), expectedValue)
  }

  getAllTestMethods() {
    const moneyPrototype = MoneyTest.prototype
    const allProps = Object.getOwnPropertyNames(moneyPrototype)
    const testMethods = allProps.filter((p) => {
      return typeof moneyPrototype[p] === 'function' && p.startsWith('test')
    })
    return testMethods
  }

  runAllTests() {
    const testMethods = this.getAllTestMethods()
    testMethods.forEach((m) => {
      console.log('Running: %s()', m)
      const method = Reflect.get(this, m)
      try {
        Reflect.apply(method, this, [])
      } catch (e) {
        if (e instanceof assert.AssertionError) {
          console.log(e)
        } else {
          throw e
        }
      }
    })
  }
}

new MoneyTest().runAllTests()
