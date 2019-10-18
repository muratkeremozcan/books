// Number() explicitly coerces anything
// true becomes 1 and false becomes 0. undefined becomes NaN, null becomes 0.

var a = {
  valueOf: function() {
    return '42';
  }
};

var b = {
  toString: function() {
    return '42';
  }
};

var c = [4, 2];

c.toString = function() {
  return this.join('');
};

Number(a); //?
typeof Number(a); //?

Number(b); //?
typeof Number(b); //?

Number(c); //?
typeof Number(c); //?

Number(''); //?
typeof Number(''); //?

Number(true); //?
Number(false); //?
Number(null); //?
Number(undefined); //?
Number([]); //?
