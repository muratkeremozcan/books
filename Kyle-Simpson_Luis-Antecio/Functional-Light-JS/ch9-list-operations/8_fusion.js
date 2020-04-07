import { compose, pipe } from '../fp-tool-belt';
/*
// chain style is declarative and easy to read. However, there is a performance concern as each operation loops over the entire list
someList
  .filter()
  .map()
  .map()

// the standalone style can look as such. The list of operations is listed bottom-to-top / inner-to-outer
map(
  fn3,
  map(
    fn2,
    filter(
      fn1, someList
    )
  )
);

*/

// Fusion deals with combining adjacent operations to reduce the number of times the list is iterated over.

const removeInvalidChars = str => str.replace(/[^\w]*/g, '');
const upper = str => str.toUpperCase();
const elide = str =>
  str.length > 10
    ? str.substr(0, 7) + '...'
    : str;

const words = "Mr. Jones isn't responsible for this disaster!".split(/\s/);

words
  .map(removeInvalidChars)
  .map(upper)
  .map(elide); //?

// you could think of it like this


elide(
  upper(
    removeInvalidChars('Mr')
  )
); //?

// We can express the three separate steps of the adjacent map(..) calls as a composition of the transformers (elide, upper, removeInvalidChars)
// since they are all unary functions and each returns the value that’s suitable as input to the next. 
// We can fuse the mapper functions using compose(..), and then pass the composed function to a single map(..) call:

words
  .map(
    compose(elide, upper, removeInvalidChars)
  ); //?

words
  .map(
    pipe(removeInvalidChars, upper, elide)
  ); //?

// for fusing filter and reduce techniques, check out appendix A