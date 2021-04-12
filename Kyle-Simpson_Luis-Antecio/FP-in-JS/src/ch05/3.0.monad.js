const wrap = require('../../model/Wrapper.js').wrap;
// const empty = require('../../model/Empty.js').empty; // empty is another container for potentially unsafe (empty) values

// suppose you want to divide a number 2. What happens if it's an odd number?
// you could return null or throw an exception. Better strategy is to make the function more specialized; data flow-aware.

// Containers/Wrappers are a functional data-type that secure potentially unsafe values. Both functors and Monads build on them.
// Functors protect values by being side effect free & composable.
// This all builds to Monads, which bring data-flow awareness to the table.


// empty is another container for potentially unsafe (empty) values
class Empty {
  map() {
    return this; // noop. Empty doesn't store a value. It represents the concept of empty or nothing.
  }
  fmap() {
    return new Empty(); // mapping a function to an Empty skips the operation
  }
  toString() {
		return 'Empty ()';
	}
}
const empty = () => new Empty();

const isEven = n => Number.isFinite(n) && (n % 2 == 0);
// half is the monad, because it lets you return an Empty container instead of null (when there are odd values)
const half = val => isEven(val) ? wrap(val / 2) : empty();

half(4); //?
// thanks to the monad, we can apply operations and we are not concerned about errors than can occur 
half(3); //?
