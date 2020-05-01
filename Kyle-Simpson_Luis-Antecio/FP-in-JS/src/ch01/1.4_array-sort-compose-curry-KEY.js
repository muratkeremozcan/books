import R from 'Ramda';
const compose = R.compose;
const curry = R.curry;
const pipe = R.pipe;
const partial = R.partial;

// More about array.sort
// If comparator returns greater than 0, p1 comes after p2.
// If comparator return less than 0, p1 comes before p2.  
// If comparator returns 0, leave a and b unchanged. 
// think of 'b' as bigger

const arr = [1, 2, 3, 4];
var descend = (a, b) => b - a;
var ascend = (a, b) => a - b;

arr.sort(ascend); //?
arr.sort(descend); //?

// or better:  pass the array as an argument (the predicate) in a function - preferred in FP
var sortAscending = arr => arr.sort(ascend)
var sortDescending = arr => arr.sort(descend);

sortAscending(arr); //?
sortDescending(arr); //?


// Problem: without a comparator, array.sort() does a string sort, which is useless
const ages = [1, 10, 21, 2]
ages.sort(); //?


// Solution 1: we can address it by converting arguments to numbers one at a time
var makeNum = arg => Number(arg);

const numericAsc = (a, b) => makeNum(a) - makeNum(b);
const numericDesc = (a, b) => makeNum(b) - makeNum(a);

ages.sort(numericAsc); //?
ages.sort(numericDesc); //?

// or better: use predicates
const ageSortAsc = arr => arr.sort((a, b) => makeNum(a) - makeNum(b));
const ageSortDesc = arr => arr.sort((a, b) => makeNum(b) - makeNum(a));

ageSortAsc(ages); //?
ageSortDesc(ages); //?



// Solution 2 (much better) : we can convert elements to numbers in a mapping function, and then sort
// this is why we prefer to pass in predicates as arguments to functions in FP. FP <3 args as predicates

var makeArrNum = arr => arr.map(index => Number(index));

sortAscending(makeArrNum(ages)); //?
sortDescending(makeArrNum(ages)); //?


/////////// the Amazingness of FP
// FP magic with curry and compose
// all we need are these lego blocks, we want to keep each piece very simple and build up complex utilities

descend = (a, b) => b - a;
ascend = (a, b) => a - b;
makeNum = arg => Number(arg);

sortDescending = arr => arr.sort(descend);
sortAscending = arr => arr.sort(ascend);
makeArrNum = arr => arr.map(makeNum);

// with curry, we make it so that the argument can be passed in later
// with compose, we move that argument from function to function

const curriedSortDesc = curry(
  sortDescending
  // arr => arr.sort(descend)
);
const curriedSortAsc = curry(
  sortAscending
  // arr => arr.sort(ascend)
);
const curriedMakeArrNum = curry(
  makeArrNum
  // arr => arr.map(makeNum)
);

compose(
  curriedSortAsc,
  curriedMakeArrNum
)(ages); //?

compose(
  curriedSortDesc,
  curriedMakeArrNum
)(ages); //?

// pipe makes it so that the flow goes top to bottom
pipe(
  curriedMakeArrNum,
  curriedSortDesc
)(ages); //?
