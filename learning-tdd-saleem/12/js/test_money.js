const assert = require('assert')
const Money = require('./money')
const Portfolio = require('./portfolio')
const Bank = require('./bank')

class MoneyTest {
  // (2) to ensure the instantiation before each test, we can rename the constructor to setup, and call it beforeEach
  setup() {
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

  testAdditionWithMultipleMissingExchangeRates() {
    const oneDollar = new Money(1, 'USD')
    const oneEuro = new Money(10, 'EUR')
    const oneWon = new Money(1, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, oneEuro, oneWon)

    const expectedError = new Error(
      'Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]'
    )
    assert.throws(
      () => portfolio.evaluate(this.bank, 'Kalganid'),
      expectedError
    )
  }

  testConversion() {
    const tenEuros = new Money(10, 'EUR')
    this.bank.addExchangeRate('EUR', 'USD', 1.2)
    let convertedAmount = this.bank.convert(tenEuros, 'USD') //?
    assert.deepStrictEqual(convertedAmount, new Money(12, 'USD'))

    // test changing the exchange rate
    this.bank.addExchangeRate('EUR', 'USD', 1.3)
    convertedAmount = this.bank.convert(tenEuros, 'USD') //?
    assert.deepStrictEqual(convertedAmount, new Money(13, 'USD'))
  }

  // (1) to ensure there is no order dependency in the tests
  // we are not declaring a new instance of the bank, and we are not specifying an exchange rate
  // and things still work, because they are order independent
  testWhatIsTheConversionRateFromEURToUSD() {
    let tenEuros = new Money(10, 'EUR')
    this.bank.addExchangeRate('EUR', 'USD', 1.2)
    assert.deepStrictEqual(
      this.bank.convert(tenEuros, 'USD'),
      new Money(12, 'USD')
    )
  }

  testConversionWithMissingExchangeRate() {
    const bank = new Bank()
    const tenEuros = new Money(10, 'EUR')
    const expectedError = new Error('Missing exchange rate: EUR->Kalganid')

    assert.throws(() => bank.convert(tenEuros, 'Kalganid'), expectedError)
  }

  getAllTestMethods() {
    const moneyPrototype = MoneyTest.prototype
    const allProps = Object.getOwnPropertyNames(moneyPrototype)
    return allProps.filter((p) => {
      return typeof moneyPrototype[p] === 'function' && p.startsWith('test')
    })
  }

  runAllTests() {
    const testMethods = this.getAllTestMethods()
    testMethods.forEach((m) => {
      console.log('Running: %s()', m)
      const method = Reflect.get(this, m)
      try {
        // (3), call the setup beforeEach
        this.setup()
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
