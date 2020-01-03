// spread and gather/rest operators also work with objects

var o1 = { a: 1, b: 2 }, 
    o2 = { c: 3 }, 
    o3 = { ... o1, ... o2, d: 4 };

/// spread operator can be used with objects
o3; //?

// gather/rest operator as well
var o1 = { b: 2, c: 3, d: 4 };
var { b, ...o2 } = o1;
b;
o2;