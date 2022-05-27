import { Money, Portfolio, PortfolioPure } from './money'

describe('Money', () => {
  test('#times amount', () => {
    const fiveDollars = new Money(5, 'USD')
    const tenDollars = fiveDollars.times(2)
    expect(tenDollars.amount).toBe(10)
    expect(fiveDollars.times(2)).toEqual(tenDollars)
  })
  // the 2nd test is covering the first, we don't need the first one

  test('#times amount, currency', () => {
    const tenEuros = new Money(10, 'EUR')
    const twentyEuros = tenEuros.times(2)
    expect(twentyEuros.amount).toBe(20)
    expect(twentyEuros.currency).toBe('EUR')
    expect(tenEuros.times(2)).toEqual(twentyEuros)
  })

  test('#divide', () => {
    const originalMoney = new Money(4002, 'KRW')
    const actualMoneyAfterDivision = originalMoney.divide(4) //?
    const expectedMoneyAfterDivision = new Money(1000.5, 'KRW') //?

    expect(actualMoneyAfterDivision).toEqual(expectedMoneyAfterDivision)
  })
})

describe('Portfolio', () => {
  test('#add, #evaluate', () => {
    const fifteenDollars = new Money(15, 'USD') //?
    const fiveDollars = new Money(5, 'USD')
    const tenDollars = fiveDollars.times(2)

    const portfolio = new Portfolio()
    portfolio.add(fiveDollars, tenDollars) //?

    portfolio.evaluate('USD') //?
    expect(portfolio.evaluate('USD')).toEqual(fifteenDollars)
  })
})

describe('PortfolioPure', () => {
  test('#add, #evaluate', () => {
    const fifteenDollars = new Money(15, 'USD') //?
    const fiveDollars = new Money(5, 'USD')
    const tenDollars = fiveDollars.times(2)

    const portfolio = new PortfolioPure([fiveDollars, tenDollars])

    portfolio.evaluate('USD')
    expect(portfolio.evaluate('USD')).toEqual(fifteenDollars)
  })
})
