const R = require('ramda');

const program = ['Functional', 'Programming', 'Curry', 'Memoization', 'Partial', 'Curry', 'Programming']
const program2 = ['Partial', 'Functional', 'Programming', 'Curry', 'Memoization', 'Curry', 'Programming']

R.toLower('Functional'); //?
R.toUpper('Functional'); //?

R.map(R.toLower, program); //?
// R has composable, curried versions, which allow right to left arguments
// program.map(R.toLower); //?
// program.map(x => x.toLowerCase()); //?

R.uniq(program); //?

// identity function returns the argument it was called with
R.identity(program); //?

// sortBy with objects makes sense:     array.object.property
// sortBy with arrays can be confusing: array.arrayElement.index   . The index is limited to the size of the array element, and no sorting happens if undefined.
// in a single layer array, does a simple string sort
R.sortBy(R.identity, program); //?
R.sortBy(R.identity, program2); //?

R.compose(
  R.map(R.toLower),
  R.uniq,
  R.sortBy(R.identity)
)(program); //?

// point free
const lowerCase = R.map(R.toLower);
const unique = R.uniq;
const sort = R.sortBy(R.identity);

R.compose(
  lowerCase,
  unique,
  sort
)(program); //?

R.pipe(
  sort,
  unique,
  lowerCase
)(program); //?