/**
 *  RxJS in Action
 *  Listing 8.5
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const ajax = url => new Promise((resolve, reject) => {
  let req = new XMLHttpRequest();
  req.open('GET', url);
  req.onload = function () {
    if (req.status == 200) {
      let data = req.responseText;
      resolve(data);
    }
    else {
      reject(new Error(req.statusText));
    }
  };
  req.onerror = function () {
    reject(new Error('IO Error'));
  };
  req.send();
});

/** Helper function to split a string into a comma-separated set of values (CSV)  */
const csv = str => str.split(/,\s*/); //#A
const cleanStr = str => str.replace(/\"|\s*/g, '');


// The Yahoo Finance web service to use with additional options used to query for the pertinent data 
// Proxying around CORS -> http://download.finance.yahoo.com
const webservice = '/external/yahoo/d/quotes.csv?s=$symbol&f=$options&e=.csv';

/** Function used to create a stream that invokes a Promise that fetches data from the web service 
 * and parses the result into CSV  */
const requestQuote$ = (symbol, opts = 'sa') =>
  Rx.Observable.fromPromise(
    ajax(webservice.replace(/\$symbol/, symbol)
      // Applies options to the request URI. s = symbol; a = asking price; o = open. 
      .replace(/\$options/, opts)))
    .retry(3)
    .catch(err => Rx.Observable.throw(
      new Error('Stock data not available. Try again later!')))
    // Converts output to CSV 
    .map(cleanStr)
    // Cleans string of any white spaces and unnecessary character
    .map(data => data.indexOf(',') > 0 ? csv(data) : data);

/** The two-second observable used to drive the execution of the real-time poll  */
const twoSecond$ = Rx.Observable.interval(2000);

const fetchDataInterval$ = symbol => twoSecond$
  .mergeMap(() => requestQuote$(symbol)
    // Propagates stock price values only when they’ve changed. 
    // this avoids unnecessary code from executing every 2 seconds when price values remain the same. 
    .distinctUntilChanged((previous, next) => {
      let prevPrice = parseFloat(previous[1]).toFixed(2);
      let nextPrice = parseFloat(next[1]).toFixed(2);
      return prevPrice === nextPrice;
    }));

// Stock symbols to render data for. These can be any symbols; 
// keep in mind that to see live changes, you must run the program during market hours. 
const symbol$ = Rx.Observable.of('FB', 'CTXS', 'AAPL');

// merging the cold currency symbol observable with a hot observable,
// and making it all hot
// now the event data is shared among all subscribers
const ticks$ = symbol$.mergeMap(fetchDataInterval$).share();

// sub1 and sub2 will share the data from the same source of events

// First subscription. Creates all necessary rows and updates the price amount in USD. 
ticks$.subscribe(
  ([symbol, price]) => {
    let id = 'row-' + symbol.toLowerCase();
    let row = document.querySelector(`#${id}`);
    if (!row) {
      addRow(id, symbol, price);
    }
    else {
      updateRow(row, symbol, price);
    }
  },
  error => console.log(error.message));

ticks$
  // Second subscription. A conformant stream that combines the price of the stock at the open, 
  // so that it can compute the change amount for the day. It appends the next change price in the stock. 
  .mergeMap(([symbol, price]) =>
    Rx.Observable.of([symbol, price])
      .combineLatest(requestQuote$(symbol, 'o')))
  // uses Ramda to flatten the internal array of data passing through, making it easier to parse, 
  // for example, [[symbol, price], open] -> [symbol, price, open]
  .map(R.flatten)
  .map(([symbol, current, open]) => [symbol, (current - open).toFixed(2)])
  .subscribe(([symbol, change]) => {
    let id = 'row-' + symbol.toLowerCase();
    let row = document.querySelector(`#${id}`);
    if (row) {
      updatePriceChange(row, change);
    }
  },
    error => console.log(`Fetch error occurred: ${error}`)
  );

const updatePriceChange = (rowElem, change) => {
  let [, , changeElem] = rowElem.childNodes;
  let priceClass = "green-text", priceIcon = "up-green";
  if (parseFloat(change) < 0) {
    priceClass = "red-text"; priceIcon = "down-red";
  }
  changeElem.innerHTML =
    `<span class="${priceClass}">
         <span class="${priceIcon}">
            (${parseFloat(Math.abs(change)).toFixed(2)})
         </span>
      </span>`;
};

const table = document.querySelector('#stocks-table');

const addRow = (id, symbol, price) => {
  let row = document.createElement('tr');
  row.setAttribute('id', id);
  let symbolElem = document.createElement('td');
  let priceElem = document.createElement('td');
  let priceChangeElem = document.createElement('td');

  symbolElem.innerHTML = symbol;
  priceElem.innerHTML = new USDMoney(price).toString();
  priceChangeElem.innerHTML = new USDMoney(0).toString();

  row.appendChild(symbolElem);
  row.appendChild(priceElem);
  row.appendChild(priceChangeElem);
  table.appendChild(row);
};

const updateRow = (rowElem, symbol, price) => {
  let [symbolElem, priceElem] = rowElem.childNodes;
  symbolElem.innerHTML = symbol;
  priceElem.innerHTML = new USDMoney(price).toString();
};

const Money = function (currency, val) {
  return {
    currency: function () {
      return currency;
    },
    value: function () {
      return val;
    },
    toString: function () {
      return `${currency} ${val}`;
    }
  };
};

const USDMoney = Money.bind(null, 'USD');
