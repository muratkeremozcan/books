// If you have an operation that needs two inputs, one of which you know now but the other will be specified later,
// you can use closure to remember the first input

// Normally, a sum(..) function would take both an x and y input to add them together.
// But in this example we receive and remember (via closure) the x value(s) first, 
// while the y value(s) are separately specified later.


function makeAdder(x) {
  x; //?
  return function sum(y) {
    x; //?
    y; //?
    return x + y;
  };
}

// first inputs
var addTo10 = makeAdder(10); 
var addTo37 = makeAdder(37);

// second inputs
addTo10(3); //?
addTo10(90); //?
addTo37(13); //?


////
// since functions are just values in JS, we can remember function values via closure:
function formatter (formatFn) {
  return function inner(value) {
    return formatFn(value); //?
  };
}
// var formatter_arrow = formatFn => value => formatFn(value);

// we create two simple unary functions lower(..) and upperFirst(..), 
// because those functions will be much easier to wire up to work with other functions in the rest of our program
var lower = formatter(function formatting(v) {
  return v.toLowerCase();
});

var upperFirst = formatter( function formatting(v) {
  return v[0].toUpperCase() + v.substr(1).toLowerCase();
  // return v[0].toUpperCase() + lower(v.substr(1)); // can re-use!
});

lower('WOW'); //?
upperFirst('helLO'); //?