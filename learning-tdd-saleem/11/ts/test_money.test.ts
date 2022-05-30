import Money from './money'
import Portfolio from './portfolio'

describe('Money', () => {
  test('testMultiplication', () => {
    const tenEuros = new Money(10, 'EUR')
    const twentyEuros = tenEuros.times(2)
    expect(tenEuros.times(2)).toEqual(twentyEuros)
  })

  test('testDivision', () => {
    const originalMoney = new Money(4002, 'KRW')
    const actualMoneyAfterDivision = originalMoney.divide(4)
    const expectedMoneyAfterDivision = new Money(1000.5, 'KRW')
    expect(actualMoneyAfterDivision).toEqual(expectedMoneyAfterDivision)
  })

  test('testAddition', () => {
    const fifteenDollars = new Money(15, 'USD')
    const fiveDollars = new Money(5, 'USD')
    const tenDollars = fiveDollars.times(2)

    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenDollars)
    expect(portfolio.evaluate('USD')).toEqual(fifteenDollars)
  })

  test('testAdditionOfDollarsAndEuros', () => {
    const fiveDollars = new Money(5, 'USD')
    const tenEuros = new Money(10, 'EUR')
    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenEuros) //?

    const expectedValue = new Money(17, 'USD')
    expect(portfolio.evaluate('USD')).toEqual(expectedValue)
  })

  test('testAdditionOfDollarsAndWons', () => {
    const oneDollar = new Money(1, 'USD')
    const elevenHundredWon = new Money(1100, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, elevenHundredWon)

    const expectedValue = new Money(2200, 'KRW')
    expect(portfolio.evaluate('KRW')).toEqual(expectedValue)
  })

  test('testAdditionOfDollarsAndWonsAndEuros', () => {
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
    expect(() => portfolio.evaluate('Kalganid')).toThrow(expectedError)
  })
})
