const assert = require('assert')
const Money = require('./money')
const Portfolio = require('./portfolio')

class MoneyTest {
  testMultiplication() {
    const tenEuros = new Money(10, 'EUR')
    const twentyEuros = tenEuros.times(2)
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
    const tenDollars = fiveDollars.times(2)
    const fifteenDollars = new Money(15, 'USD')
    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenDollars)
    assert.deepStrictEqual(portfolio.evaluate('USD'), fifteenDollars)
  }

  getAllTestMethods() {
    // return ['testMultiplication', 'testDivision', 'testAddition']
    // not sure why I'd use this below instead...
    let moneyPrototype = MoneyTest.prototype
    let allProps = Object.getOwnPropertyNames(moneyPrototype)
    return allProps.filter((p) => {
      return typeof moneyPrototype[p] === 'function' && p.startsWith('test')
    })
  }

  // runAllTests() {
  //   const testMethods = this.getAllTestMethods()
  //   testMethods.forEach((m) => {
  //     // this.testMultiplication()
  //     // this.testDivision()
  //     // this.testAddition()
  //     let method = Reflect.get(this, m)
  //     Reflect.apply(method, this, [])
  //   })
  // }

  runAllTests() {
    return this.getAllTestMethods().map((m) => {
      console.log('Running:', m)
      // get the object for each method via reflection
      const method = Reflect.get(this, m)
      // invoke the method with no arguments on this object (MoneyTest)
      try {
        return Reflect.apply(method, this, [])
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
