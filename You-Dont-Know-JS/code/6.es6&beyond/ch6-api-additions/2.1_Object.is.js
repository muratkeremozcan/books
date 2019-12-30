// for value comparisons more strict than ===
// However, in cases where you’re trying to strictly identify a NaN or -0 value, Object.is(..) is now the preferred option.

var x = NaN,
    y = 0,
    z = -0;

// we do not want this
x === x; //?
y === z; //?

// much better
Object.is(x, x); //?
Object.is(y, z); //?

// you prefer to use isNaN(x) instead of Object.is(x, NaN) 
isNaN(x); //?
// but, do not check for -0 like this anymore
(x == 0 && 1/x === -infinity); //?