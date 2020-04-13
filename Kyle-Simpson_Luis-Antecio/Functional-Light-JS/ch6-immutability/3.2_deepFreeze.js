const deepFreeze = require('./deep-freeze');

let y = Object.freeze([2,3,[4,5]]);
let z = deepFreeze([2,3,[4,5]]);

y[2][0] = 42;
y; 

z[2][0] = 42
z; //?

