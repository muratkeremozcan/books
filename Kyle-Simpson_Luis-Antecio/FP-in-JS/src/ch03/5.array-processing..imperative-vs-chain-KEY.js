// read a list of names, normalize them, remove any duplicates, and sort the final result.


let names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John Von Neumann', 'stephen_kleene'];

{ // imperative code is made to solve a particular problem, with low level of abstraction
  // which makes re-use difficult, increases complexity and chance of errors
  let result = [];
  for (let i = 0; i < names.length; i++) { // loop through the names in the array
    var n = names[i];
    if (n !== undefined && n !== null) { // validity check, can also do != null with null coercion
      var ns = n.replace(/_/, ' ').split(' '); // normalize array data
      for (let j = 0; j < ns.length; j++) {
        var p = ns[j];
        p = p.charAt(0).toUpperCase() + p.slice(1);
        ns[j] = p;
      }
      if (result.indexOf(ns.join(' ')) < 0) { // eliminates duplicates by checking if the name exists in the results
        result.push(ns.join(' '));
      }
    }
  }
  result.sort(); //?
}

// functional style: much less code and easy to reason about

import _ from 'lodash';
const isValid = val => !_.isUndefined(val) && !_.isNull(val);

// _(names) // either is fine
_.chain(names)
  .filter(isValid) // validity check
  .map(n => n.replace(/_/, ' ')) // normalize array data
  .map(_.startCase)
  .uniq() // eliminates duplicate
  .sort()
  .value(); //?