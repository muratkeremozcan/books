function getStock() {
  return {
    symbol: "IBM",
    price: 100.0,
    open: 99.5,
    volume: 100000,
  };
}
let { symbol, price } = getStock();
symbol;
console.log(`The price of ${symbol} is ${price}`);
