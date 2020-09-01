// If you have an operation that needs two inputs, one of which you know now but the other will be specified later,
// you can use closure to remember the first input

// Normally, a sum(..) function would take both an x and y input to add them together.
// But in this example we receive and remember (via closure) the x value(s) first, 
// while the y value(s) are separately specified later.

function makeAdder(x) {
  x;
  return function sum(y) {
    x;
    y;
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

{ // KEY: we know we will get a formatFn, but we do not yet know what argument it will have.
  // so, we retain the formatFn in a closure, and when we get an argument, we pass it into the format function and return them all
  function formatter(formatFn) {
    return function inner(value) {
      // formatFn is retained in the closure!!
      formatFn; //?
      return formatFn(value); //?
    };
  }

  // the format function is lower (or upperfirst). We do not know what argument it will have, but we know what it does! So we define what it does!
  var lower = formatter(function formattingToLower(v) {
    return v.toLowerCase();
  });

  var upperFirst = formatter(function formattingToUpperFirst(v) {
    return v[0].toUpperCase() + v.substr(1).toLowerCase();
    // return v[0].toUpperCase() + lower(v.substr(1)); // can re-use!
  });

  // once we get the argument, we return formatFn(theArgument)
  lower('WOW'); //?
  upperFirst('helLO'); //?
}

{
  /** formatter is a function that takes a formatFn as an argument 
  * it has an inner function which retains formatFn in a closure, while waiting for a 'value' argument 
  * once the 'value'  argument is received, formatFn is returned with that 'value' argument */
  const formatter = formatFn => value => formatFn(value);
  let lower = formatter(v => v.toLowerCase()); //  formatter(formatFn) . formatFn is saved in the closure, and when it receives an argument, we return formatFn(value)
  let upperfirst = formatter(v => v[0].toUpperCase() + lower(v.substr(1)) );

  lower('WOW'); //?
  upperfirst('helLO'); //?
}