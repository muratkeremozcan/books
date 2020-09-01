function isShortEnough(str) {
  return str.length <= 10;
}

function isLongEnough(str) {
  return str.length >= 5;
}

function strUpperCase(str) {
  return str.toUpperCase();
}

// performs better but has side effect which doesn't matter
function listCombine(list, val) {
  list.push(val);
  return list;
}

function strConcat(str1, str2) {
  return str1 + str2;
}

var words = ["You", "have", "written", "something", "very", "interesting"];

words
  .map(strUpperCase)
  .filter(isLongEnough)
  .filter(isShortEnough)
  .reduce(strConcat, ''); //?

/* 2 issues:
 (1) Performance: if there are lots of values in the array, each operation can slow things down
     If the arrays are Observables, each filter produces a separate Observable.
 
 (2) Composition: if you try to chain & compose different kinds of operations: .map .filter .filter .reduce 
    the shape of each op being different is a problem

TRANSDUCERS
To transduce means to transform with a reduce; a composable reducer.
Transducers express map(..)s and filter(..)s as reduce(..)s, and then abstracts out the common combination operation,
to create unary reducer-producing functions that are easily composed.

A transducer takes one reducing function and returns another.

Transducers don't care about
- what the reducing function does
- the context of use 
- the source of inputs

Transducing primarily improves performance, which is especially obvious if used on an observable. Solves issue (1)
Transducers compose using ordinary function composition. Solves issue (2)

We use transducing to compose adjacent map(..), filter(..), and reduce(..) operations together.
Transducing is how we express a more declarative composition of functions that would otherwise not be directly composable.
*/


var transducers = require("transducers-js");

var transformer = transducers.comp(
  transducers.map(strUpperCase),
  transducers.filter(isLongEnough),
  transducers.filter(isShortEnough)
)

transducers.transduce(transformer, listCombine, [], words); //?

//  Because calling transformer(..) produces a transform object and not a typical binary transduce-reducer function,
// the library also provides toFn(..) to adapt the transform object to be useable by native array reduce(..): 
words.reduce(
  transducers.toFn(transformer, strConcat),
  ""
); //?


//  into(..) is another provided helper that automatically selects a default combination function 
// based on the type of empty / initial value specified:
transducers.into( [], transformer, words); //?
transducers.into( '', transformer, words); //?