import Money from './money'
import Portfolio from './portfolio'
import Bank from './bank'

describe('Money', () => {
  // (1) order independence is easy with Jest, we achieve it like this
  let bank: Bank

  beforeAll(() => {
    bank = new Bank()
    bank.addExchangeRate('EUR', 'USD', 1.2)
    bank.addExchangeRate('USD', 'KRW', 1100)
  })

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
    expect(portfolio.evaluate(bank, 'USD')).toEqual(fifteenDollars)
  })

  test('testAdditionOfDollarsAndEuros', () => {
    const fiveDollars = new Money(5, 'USD')
    const tenEuros = new Money(10, 'EUR')
    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenEuros) //?

    const expectedValue = new Money(17, 'USD')
    expect(portfolio.evaluate(bank, 'USD')).toEqual(expectedValue)
  })

  test('testAdditionOfDollarsAndWons', () => {
    const oneDollar = new Money(1, 'USD')
    const elevenHundredWon = new Money(1100, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, elevenHundredWon)

    const expectedValue = new Money(2200, 'KRW')
    expect(portfolio.evaluate(bank, 'KRW')).toEqual(expectedValue)
  })

  test('testAdditionOfDollarsAndWonsAndEuros', () => {
    const oneDollar = new Money(1, 'USD')
    const oneEuro = new Money(10, 'EUR')
    const oneWon = new Money(1, 'KRW')
    const portfolio = new Portfolio()
    portfolio.add(oneDollar, oneEuro, oneWon)

    const expectedError = new Error(
      'Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]'
    )
    // @ts-expect-error
    expect(() => portfolio.evaluate(bank, 'Kalganid')).toThrow(expectedError)
  })

  test('testConversion', () => {
    const bank = new Bank()
    const tenEuros = new Money(10, 'EUR')

    bank.addExchangeRate('EUR', 'USD', 1.2)
    const convertedAmount = bank.convert(tenEuros, 'USD')

    expect(convertedAmount).toEqual(new Money(12, 'USD'))
  })

  test('testConversion to the same currency', () => {
    const bank = new Bank()
    const tenEuros = new Money(10, 'EUR')

    bank.addExchangeRate('EUR', 'EUR', 1)
    const convertedAmount = bank.convert(tenEuros, 'EUR')

    expect(convertedAmount).toEqual(new Money(10, 'EUR'))
  })

  test('testConversionWithMissingExchangeRate', () => {
    const bank = new Bank()
    const tenEuros = new Money(10, 'EUR')
    const expectedError = new Error('Missing exchange rate: EUR->Kalganid')

    // @ts-expect-error
    expect(() => bank.convert(tenEuros, 'Kalganid')).toThrow(expectedError)
  })

  test('orderIndependence', () => {
    // (2) we are not declaring a new instance of the bank, and we are not specifying an exchange rate
    // and things still work, because they are order independent
    let tenEuros = new Money(10, 'EUR')

    const convertedAmount = bank.convert(tenEuros, 'USD')

    expect(convertedAmount).toEqual(new Money(12, 'USD'))
  })
})
