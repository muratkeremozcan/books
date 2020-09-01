var Currency = require('./5_ES6_module.exports_Class'); // module within same directory

var canadianDollarConversionRate = 0.91;
var currency = new Currency(canadianDollarConversionRate);

console.log( currency.canadianToUS(50));
console.log( currency.usToCanadian(30));