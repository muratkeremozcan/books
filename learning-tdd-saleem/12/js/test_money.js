const assert = require('assert')
const Money = require('./money')
const Portfolio = require('./portfolio')
const Bank = require('./bank')

class MoneyTest {
  constructor() {
    this.bank = new Bank()
    this.bank.addExchangeRate('EUR', 'USD', 1.2)
    this.bank.addExchangeRate('USD', 'KRW', 1100)
  }

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
    assert.deepStrictEqual(portfolio.evaluate(this.bank, 'USD'), fifteenDollars)
  }

  testAdditionOfDollarsAndEuros() {
    const fiveDollars = new Money(5, 'USD')
    const tenEuros = new Money(10, 'EUR')
    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenEuros)
    const expectedValue = new Money(17, 'USD')
    assert.deepStrictEqual(portfolio.evaluate(this.bank, 'USD'), expectedValue)
  }

  testAdditionOfDollarsAndWons() {
    const oneDollar = new Money(1, 'USD')
    const elevenHundredWon = new Money(1100, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, elevenHundredWon)
    const expectedValue = new Money(2200, 'KRW')
    assert.deepStrictEqual(portfolio.evaluate(this.bank, 'KRW'), expectedValue)
  }

  getAllTestMethods() {
    const moneyPrototype = MoneyTest.prototype
    const allProps = Object.getOwnPropertyNames(moneyPrototype)
    const testMethods = allProps.filter((p) => {
      return typeof moneyPrototype[p] === 'function' && p.startsWith('test')
    })
    return testMethods
  }

  testAdditionWithMultipleMissingExchangeRates() {
    const oneDollar = new Money(1, 'USD')
    const oneEuro = new Money(10, 'EUR')
    const oneWon = new Money(1, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, oneEuro, oneWon)

    // Red (1) write the failing test
    const expectedError = new Error(
      'Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]'
    )
    // note: In JavaScript, we don’t call the method under test as part of the assert.throws()
    // otherwise the assert statement would itself fail to execute successfully.
    // Instead, we pass an anonymous function object as the first parameter, which calls the method under test.
    assert.throws(
      () => portfolio.evaluate(this.bank, 'Kalganid'),
      expectedError
    )
  }

  testConversion() {
    const bank = new Bank()
    const tenEuros = new Money(10, 'EUR')
    // Red (1) add a test for the feature we want (addExchangeRate)
    bank.addExchangeRate('EUR', 'USD', 1.2)
    // Red (3) add a test for the feature we want (convert)
    const convertedAmount = bank.convert(tenEuros, 'USD') //?

    assert.deepStrictEqual(convertedAmount, new Money(12, 'USD'))
  }

  // here we added a test for the edge cases under the if logic
  testConversionWithMissingExchangeRate() {
    const bank = new Bank()
    const tenEuros = new Money(10, 'EUR')
    const expectedError = new Error('Missing exchange rate: EUR->Kalganid')

    assert.throws(() => bank.convert(tenEuros, 'Kalganid'), expectedError)
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
