// DESTRUCTURING: allows to write less code when we need to initialize some variables with data enclosed in other objects, arrays or functions

function getStock() {
  return {
    symbol: 'IBM',
    price: 100.00,
    alias_test: 'IamAlias'
  }
}

let { symbol, price, stockExchange_defaultValue = 'NASDAQ', alias_test: alli } = getStock();
symbol; //?
price; //?
// default value
stockExchange_defaultValue //?
// aliasing
alli; //? 

//////////////////

let msft = {
  symbol: 'MSFT',
  lastPrice: 50.00,
  exchange: {
    name: 'NASDAQ',
    tradingHours: '9:30AM-4PM',
    city: 'NYC'
  }
};

function printStockInfo(stock) {
  let { symbol, exchange: {name, tradingHours} } = stock; // destructuring a nested object
  console.log(`${symbol} , ${name}, ${tradingHours}`);
}

printStockInfo(msft);

//////////////////

var o = {p: 42, q: true};
var {p: foo, q: bar} = o;
 
console.log(foo); // 42 
console.log(bar); // true

/////////////////
// Destructuring arrays

let [name1, name2] = ['Smith', 'Clinton']
name1;
name2;

// extracting part of an array
let [, , part3] = ['Smith', 'Clinton', 'Jose'];
part3

// extracting part of an array, function example
function getCustomers() {
  return ['Smith', , , 'Gonzales'];
}
let [firstCustomer, , , lastCustomer] = getCustomers();
firstCustomer; //?
lastCustomer; //?


// destructuring with rest parameters
let customers = ['Smith', 'Clinton', 'Lou', 'Gonzales'];
let [firstCust, secondCust, ...otherCust] = customers;
firstCust; //?
secondCust; //?
otherCust; //?
let [cust1, cust2] = otherCust;
cust1; //?
cust2; //?

// destructuring with rest parameters, function example
function processFirstTwoCustomers([firstCust, secondCust, ...otherCust]) {
  console.log(firstCust);
  console.log(secondCust);
  console.log(otherCust);
}
processFirstTwoCustomers(customers);