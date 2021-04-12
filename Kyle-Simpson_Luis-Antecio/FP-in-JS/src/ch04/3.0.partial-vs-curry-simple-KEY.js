// partial in simple terms: if you have a function with five parameters, and you supply three of the arguments, 
// you end up with a function that expects the last two.

// you can use Ramda or Lodash for partial or curry. The book recommends Ramda curry and Lodash partial.
import _ from 'lodash';

const add = (x, y, z) => x + y + z;

// curry, as you know: wrap the function and pass arguments later; it will work when there are enough arguments
const curryAdd = _.curry(add);
curryAdd(); // noise
curryAdd(7); // noise
curryAdd(7,3); // noise
curryAdd(7)(3); // same noise
curryAdd(7,3,10); //?
curryAdd(7)(3)(10); //?

// key difference between partial and curry: useful if there are guaranteed arguments 
const partialAdd = _.partial(add, 7); 
partialAdd(); // noise
partialAdd(3); // noise
partialAdd(3, 10); //?

// can also have multiple pre-fixed arguments, or none, which becomes like curry, just can't ()()()...
const partialLikeCurry = _.partial(add);
partialLikeCurry(); // noise
partialLikeCurry(7, 3, 10); //?

// this is showing how currying is an automated way of composing partials... You should just use curry if you ever have to do this.
const secondPartial = _.partial(partialAdd, 3);
secondPartial(10); //?
const thirdPartial = _.partial(secondPartial, 10);
thirdPartial(); //?
const composedPartial = _.partial( _.partial( _.partial(add, 7), 3), 10);
composedPartial(); //?
const justUseCurryInstead = _.curry(add)(7,3,10); //?


// conclusion: partial has a very niche use over curry; if there are arguments that are guaranteed, you can use partial

