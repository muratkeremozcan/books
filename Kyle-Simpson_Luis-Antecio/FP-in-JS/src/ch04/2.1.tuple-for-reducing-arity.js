// not necessary with TS, but for the sake of exercise

const Tuple = require('./helper').Tuple;
const StringPair = Tuple(String, String);

const name = new StringPair('Barkley', 'Rosser');

// When combined with JavaScript ES6 support for destructured assignment, 
// you can map tuple values to variables in a clean manner.

let [first, last] = name.values();
first; //?
last; //?


// type error
const fullName = new StringPair('J', 'Barkley', 'Rosser');
