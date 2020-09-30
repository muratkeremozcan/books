export class Currency {
  constructor(canadianDollarConversionRate) {
    this.canadianDollarConversionRate = canadianDollarConversionRate;
  }
  // NOTE: when the function is in a class, you do not use the function keyword because CLASS PROPERTIES MUST BE METHODS
  // this is also why you cannot use arrow functions here, yet...
  roundTwoDecimals(amount) {
    return Math.round(amount * 100) / 100;
  }
  canadianToUS (canadian) {
    return this.roundTwoDecimals(canadian * this.canadianDollarConversionRate);
  }
  usToCanadian (us) {
    return this.roundTwoDecimals(us / this.canadianDollarConversionRate);
  }
}
// can also
// export { Currency };
// YOU CAN ALSO INSTANTIATE at the source
// you can also have a serviceFactory in between, for isolation
// export const currency = new Currency(0.91);

