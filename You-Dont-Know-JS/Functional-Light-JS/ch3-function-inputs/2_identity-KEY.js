// another common base utility in the FP toolbelt is 
// a function that takes one argument and does nothing but return the value untouched

function identity(v) {
  return v;
}

var identityArrow = v => v;

// example of use
// imagine you’d like to split up a string using a regular expression, but the resulting array may have some empty values in it. 
// To discard those, we can use JS’s filter(..) array operation with identity(..) as the predicate:

// regex to split a string into words
var words = " Now is the time for all...".split(/\s|\b/); //?
words.filter(identity); //?


// another example
/** takes the message and returns it, or returns a formatted message  */
function output(msg, formatFn = identity) {
  msg = formatFn(msg);
  console.log(msg);
}

function upper(txt) {
  return txt.toUpperCase();
}

output('Hello World');
output('Hello World', upper);