// similar to isNaN The standard global isFinite(..) coerces its argument, 
// but Number.isFinite(..) omits the coercive behavior

var a = NaN,
    b = Infinity,
    c = 42,
    d = '42';

isFinite(a); //?
isFinite(b); //?
isFinite(c); //?
// if you prefer the coercion, use the global isFinite
isFinite(d); //?

Number.isFinite(a); //?
Number.isFinite(b); //?
Number.isFinite(c); //?
// no coercion here
Number.isFinite(d); //?
// if you need can explicitly coerce into a Number() before passing it in
Number.isFinite(+d); //?
Number.isFinite(Number(d)); //?