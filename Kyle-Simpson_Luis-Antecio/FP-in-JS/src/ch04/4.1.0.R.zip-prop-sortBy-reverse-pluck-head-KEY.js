import R from 'ramda';
import _ from 'lodash';

let students = ['Rosser', 'Turing', 'Kleene', 'Church'];
let grades = [80, 100, 90, 99, 500];

// note: all Ramda functions are curried, so you can specify arity: (a, b, c) can be (a)(b)(c)

// zip: creates an array of tuples, pairing elements from 2 arrays. If arrays are not the same length, the extra elements are discarded.
// think of it like creating a table of columns
var zipped = R.zip(students)(grades);  //?
// [
//   ['Rosser', 80],
//   ['Turing', 100],
//   ['Kleene', 90],
//   ['Church', 99]
// ]


// prop: given an object0 (or array), gives the elements at specified key (or index). Can also curry.
var index_1 = R.prop(1, zipped); //?


// sortBy with objects makes sense:     array.object.property
// sortBy with arrays can be confusing: array.arrayElement.index   . The index is limited to the size of the array element, and no sorting happens if undefined.

// will sort by 80
var sorted = R.sortBy(R.prop(1), zipped); //?
// [
//   [ 'Rosser', 80 ], 
//   [ 'Kleene', 90 ], 
//   [ 'Church', 99 ], 
//   [ 'Turing', 100 ]
// ] 


// reverse is self-explanatory
var reversed = R.reverse(sorted); //?
// [ 
//   [ 'Turing', 100 ], 
//   [ 'Church', 99 ], 
//   [ 'Kleene', 90 ], 
//   [ 'Rosser', 80 ] 
// ] 

// pluck gets the column by column index
var plucked = R.pluck(0, reversed); //?
R.pluck(1, reversed); //?


var theHead = R.head(plucked); //?