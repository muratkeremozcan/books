const R = require('ramda');
// In functional programming, the notion of boxing the dangerous code still applies, but you throw away the try-catch block. 
// Instead, walling off impurity is made a first-class citizen in by the use of functional data types.
// this is called wrapping or containerizing


/** used to encapsulate potentially erroneous values*/
class Wrapper {
  /** creates a new wrapped context/container/value */
  constructor(value) {
    this._value = value;
  }
  /** takes a wrapped context/container/value, applies a function to it */
  map(f) {
    return f(this._value);
  }
  // functor map
  /** takes a wrapped context/container/value, applies a function to it, creates & returns a new wrapped context */
  fmap(f) {
    return new Wrapper(f(this._value));
  }
  toString() {
    return `wrapped: ${this._value}`;
  }
}
/** helper function that creates a new wrapped context/container/value using the value passed to it */
const wrap = val => new Wrapper(val);

// a new wrapped context/container/value created
const wrappedValue = wrap('Get Functional'); //?

// the only way to extract the value is to use the identity function, which returns the arg it is called with. 
wrappedValue.map(R.identity); //?

wrappedValue.toString(); //?

// you can map any function to this container
wrappedValue.map(R.toUpper); //?

// the responsibility of error checking is on the caller function
const wrappedNull = wrap(null);
wrappedNull.map(R.identity); //?
// wrappedNull.map(R.toUpper); // null does not have a method named "toUpperCase"


// fmaps can be chained, because it wraps the result again into a new container of the same type
wrappedValue.fmap(R.identity); //?
wrappedValue.fmap(R.toUpper); //?

wrappedValue.fmap(R.identity).map(R.identity); //?
wrappedValue.fmap(R.toUpper).map(R.identity); //?
wrappedValue.fmap(R.identity).map(R.toUpper); //?
wrappedValue.fmap(R.toUpper).map(R.toUpper); //?

// remember: tap is useful to bridge void functions (such as logging or writing a file or an HTML page)
// into your composition without having to any create additional code
// because it throws away the return (which is void) 
wrappedValue.fmap(R.identity).map(R.tap(console.log)); //?