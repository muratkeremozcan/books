export class Wrapper {
  /** Type constructor, for creating monadic types. (the constructor).
   * Creates a new wrapped context/container/value */
  constructor(value) {
    this._value = value;
  }
  /** Unit function, for inserting value of a type into a monadic structure. (the helper function).
   * Creates a new wrapped context/container/value using the value passed to it. */
  static of(a) {
    return new Wrapper(a);
  }
  /** Bind function, chains operations together. (the functor map).
   * takes a wrapped context/container/value, applies a function to it, creates & returns a new wrapped context */
  map(f) {
    return Wrapper.of(f(this._value));
  }
	/** Join function, flattens layers of monadic structures into one. (flattens nested layers). 
   * Important for composing multiple monad returning functions
  */
  join() {
    if (!(this._value instanceof Wrapper)) {
      return this;
    }
    return this._value.join();
  }
  /** used to extract the final value out */
  get() {
    return this._value;
  }
  /** Returns a textual representation of this structure*/
  toString() {
    return `Wrapper (${this._value})`;
  }
}

// Containers/Wrappers are a functional data-type that secure potentially unsafe values. Both functors and Monads build on them.
// Functors protect values by being side effect free & composable.
// This all builds to Monads, which bring data-flow awareness to the table.


import R from 'ramda';
const WrapperMonad = Wrapper;

WrapperMonad.of('Hello Monads')
  .map(R.toUpper)
  .map(R.identity); //?

// of() is like calling the helper function
new WrapperMonad('HELLO MONADS!'); //?

