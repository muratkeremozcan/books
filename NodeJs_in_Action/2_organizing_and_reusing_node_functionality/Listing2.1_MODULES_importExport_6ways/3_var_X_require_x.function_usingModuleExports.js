// EXPORTed: module.exports = { functions.. } or export { functions.. }
// IMPORT: both require or import will work. 
// The only delta is require will be object.method() format and import will directly call the function

var currency = require('./3_module.exports_functions_atTheEnd'); // module within same directory
// the way to import is the same in  export varieties
console.log( currency.canadianToUS(50));
console.log( currency.usToCanadian(30));

import {canadianToUS, usToCanadian} from  './3_module.exports_functions_atTheEnd';

console.log( canadianToUS(50));
console.log( usToCanadian(30));