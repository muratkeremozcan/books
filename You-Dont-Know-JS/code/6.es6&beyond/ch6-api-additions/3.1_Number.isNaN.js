// The standard global isNaN(..) utility has been broken since its inception, 
// it returns true for things that are not numbers, because it coerces the argument to a number type (which can falsely result in a NaN).
// ES5 Number.isNaN

var a = NaN,
    b = 'NaN',
    c = 42;

isNaN(c); //?
isNaN(a); //?
// wtf?
isNaN(b); //?
// good
Number.isNaN(c); //?
