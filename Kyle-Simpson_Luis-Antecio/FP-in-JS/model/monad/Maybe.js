/**
 * Custom Maybe Monad used in FP in JS book written in ES6
 * Author: Luis Atencio
 */ 
exports.Maybe = class Maybe {
	/** a container that wraps a defined value */ 
	static just(a) {
		return new exports.Just(a);
	}
	/** a container that either has no value or a failure that needs no additional info */
	static nothing() {
		return new exports.Nothing();
	}
	/** Handles the null-checking on your behalf.
	 * If the value lifted in the monad is null, instantiates a nothing
	 * Otherwise stores value in Just subtype to handle the presence of a value  */
	static fromNullable(a) {
		return a !== null ? Maybe.just(a) : Maybe.nothing();
	}
	static of(a) {
		return Maybe.just(a);
	}
	get isNothing() {
		return false;
	}
	get isJust() {
		return false;
	}
};


/** Derived class Just -> handles the presence of a value */
exports.Just = class Just extends exports.Maybe {
	constructor(value) {
		super();
		this._value = value;
	}

	get value() {
		return this._value;
	}
	/** maps a function to Just, transforms its value and stores it back into the container */
	map(f) {
		return exports.Maybe.fromNullable(f(this._value));
	}

	chain(f) {
		return f(this._value);
	}
  /** extracts the value from the structure or a provided default monad unity operation */
	getOrElse() {
		return this._value;
	}
	/** if a value is present and matches the given predicate
	 * returns a Just representing the value
	 * otherwise returns nothing
	 */
	filter(f) {
		exports.Maybe.fromNullable(f(this._value) ? this._value : null);
	}

	get isJust() {
		return true;
	}

	toString () {
		return `Maybe.Just(${this._value})`;
	}
};

/**  Derived class Empty -> handles the abscense of a value */
exports.Nothing = class Nothing extends exports.Maybe {
	map(f) {
		return this;
	}
	
	chain(f) {
		return this;
	}

	/** attempting to extract a value from Nothing generates an exception 
	 * indicating a bad use of the monad.
	 */
	get value() {
		throw new TypeError("Can't extract the value of a Nothing.");
	}
  /** ignores the value and returns the other  */
	getOrElse(other) {
		return other;
	}
	/** if a value is present and matches the given predicate
	 * returns a Just representing the value
	 * otherwise returns nothing
	 */
	filter() {
		return this._value;
	}

	get isNothing() {
		return true;
	}	

	toString() {
		return 'Maybe.Nothing';
	}
};