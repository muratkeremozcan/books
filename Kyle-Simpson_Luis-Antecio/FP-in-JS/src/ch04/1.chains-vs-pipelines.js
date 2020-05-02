// Viewing functions as mappings of types is necessary to understand how they can be chained and pipelined:
// - Chaining methods together : tightly coupled to the owning object
// - Arranging function pipelines (compose/pipe) : flexible, but you have to watch out for arity and type

const isEmpty = s => !s || !s.replace(/\s/g,''); // trim all whitespace
// const isEmpty = s => !s || !s.trim();

isEmpty('Hello World'); //?
isEmpty(''); //?


import _ from 'lodash';
let names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John Von Neumann', 'stephen_kleene'];
const isValid = val => !_.isUndefined(val) && !_.isNull(val);
// const isValid = val => val != null; // same thing


// Chaining is  a syntactical improvement over imperative code and drastically improves its readability. 
// Unfortunately, it’s contrived and tightly coupled to the owning object that confines the number of methods you can apply in the chain.
// In this case, you’re obliged to use only the set of operations provided by Lodash, and you wouldn’t be able to easily
// connect functions from different libraries (or your own) into one program.

// read a list of names, normalize them, remove any duplicates, and sort the final result.
_.chain(names)
  .filter(isValid) // validity check
  .map(n => n.replace(/_/, ' ')) // normalize array data
  .map(_.startCase)
  .uniq() // eliminates duplicate
  .sort()
  .value(); //?

// Functional programming removes the limitations present in method chaining and provides the flexibility to combine any set of functions,
// chaining makes tight connections via an object’s methods, 
// whereas a pipeline links inputs and outputs of any functions—arriving at loosely coupled components. 
// But for this linkage to be possible, the connecting functions must be compatible in terms of arity and type
