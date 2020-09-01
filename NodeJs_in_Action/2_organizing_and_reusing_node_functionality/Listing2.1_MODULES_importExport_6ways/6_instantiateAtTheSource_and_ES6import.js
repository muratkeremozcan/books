import { Currency } from './6_exportConstNew_instantiateAtTheSource';
var canadianDollarConversionRate = 0.91;
var currency = new Currency(canadianDollarConversionRate);
// IMPORTANT: if you instantiate at the source all you need is:
// import { currency } from './6_exportConstNew_instantiateAtTheSource';


console.log( currency.canadianToUS(50));
console.log( currency.usToCanadian(30));