// used for filling an existing array entirely (or partially) with a specified value
var a = Array(4); //?
a.fill(undefined); //?

// optionally takes start and end parameters which indicate a subset portion of the array to fill
var b = [null, null, null, null].fill(42, 1, 3);
b
