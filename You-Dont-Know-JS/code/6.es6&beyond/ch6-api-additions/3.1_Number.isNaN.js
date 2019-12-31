// The standard global isNaN(..) utility has been broken since its inception, 
// it returns true for things that are not numbers (ex: strings), because it coerces the argument to a number type (which can falsely result in a NaN).
// ES5 Number.isNaN

var a = NaN,
    b = 'N',
    c = 42;

isNaN(c); //?
isNaN(a); //?
// wtf?
isNaN(b); //?

// good
Number.isNaN(c); //?
