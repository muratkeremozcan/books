import Rx from 'rxjs/Rx';

/** simulates stock prices */
const Money = function (currency, val) {
  return {
    value: function () {
      return val;
    },
    currency: function () {
      return currency;
    },
    toString: function () {
      return `${currency} ${val}`;
    }
  };
};
/** generates a random number */
const newRandomNumber = () => Math.floor(Math.random() * 100);
/** needed to instantiate the object WITH prefix with $ */
const USD = Money.bind(null, '$'); // $ will be the first arg, newRandomNumber will be the 2nd

Rx.Observable.interval(1000)
  .skip(1) // skips the first item emitted, which is 0
  .take(5) // will only take the first 5 items, after skipping
  .map(() => new USD(newRandomNumber()))
  .map(usd => usd.toString())
  .subscribe(console.log)