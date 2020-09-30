var currency = require('./2_export_function_or_export_let_var'); // module within same directory
// the way to import is the same in  export varieties
console.log( currency.canadianToUS(50));
console.log( currency.usToCanadian(30));


// can also 
import {canadianToUS, usToCanadian} from './2_export_function_or_export_let_var';

canadianToUS(50); //?
usToCanadian(30); //?