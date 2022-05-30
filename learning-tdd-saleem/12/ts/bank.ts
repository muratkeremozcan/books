import Money from './money'

export type Currency = 'USD' | 'EUR' | 'KRW'

export default class Bank {
  exchangeRates: Map<string, number>
  constructor() {
    this.exchangeRates = new Map<string, number>()
  }

  addExchangeRate(
    currencyFrom: Currency,
    currencyTo: Currency,
    rate: number
  ): Map<string, number> {
    // return this.exchangeRates
    return this.exchangeRates.set(`${currencyFrom}->${currencyTo}`, rate)
  }

  convert(money: Money, currency: Currency): Money {
    if (money.currency === currency) return new Money(money.amount, currency)

    const key = `${money.currency}->${currency}`
    const rate = this.exchangeRates.get(key)

    if (rate == null) throw new Error(`Missing exchange rate: ${key}`)
    return new Money(money.amount * rate, currency)
  }
}
