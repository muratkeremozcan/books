/**
 * ES6 versions of Either monad used in FP in JS
 * Author: Luis Atencio
 */ 
exports.Either = class Either {
	/** can hold an exception or successful value */
	constructor(value) {
		this._value = value;
	}
	
	get value() {
		return this._value;
	}
	
	static left(a) {
		return new exports.Left(a);
	}
	
	static right(a) {
		return new exports.Right(a);
	}
	/**Takes Right case (valid value) or Left case (invalid value) */
	static fromNullable(val) {
		return val !== null && val !== undefined ? Either.right(val) : Either.left(val);
	}
	/**Creates a new instance holding a value on the Right */
	static of(a){
		return Either.right(a);
	}
};

exports.Left = class Left extends exports.Either {
	/** Transforms a value on the Right by mapping a function to it. Does nothing on the left */
	map(_) {		
		return this; // noop
	}
	/** Extracts the Right value if it exists, otherwise produces a TypeError */
	get value() {
		throw new TypeError("Can't extract the value of a Left(a).");
	}
	/** Extracts the Right value. If it doesn't have one, returns the given default. */
	getOrElse(other) {
		return other;
	}
	/** Applies a function to the Left, does nothing on the Right */
	orElse(f) {
		return f(this._value);
	}
	
	/** Think of .chain as shortcut to avoid using join after map to flatten the layers from combining monad-returning functions.
	 * Map & auto-flatten 
	 * Applies a function to the Right and returns that value, does nothing on the Left. */
	chain(f) {
		return this;
	}
	/** Throws an exception on the Left, otherwise ignores the exception and returns the valid value. */
	getOrElseThrow(a) {
		throw new Error(a);
	}
	/** If the value is present and meets the given predicate, returns a Right describing  the value. Otherwise returns empty Left. */
	filter(f) {
		return this;
	}
	
	get isRight() {
		return false;
	}

	get isLeft() {
		return true;
	}

	toString() {
		return `Either.Left(${this._value})`;
	}
};

exports.Right = class Right extends exports.Either {
	/** Transforms the value on the Right structure by mapping a function to it. Does nothing on the Left. */
	map(f) {		
		return exports.Either.of(f(this._value));
	}
	/** Extracts the Right value. If it doesn't have one, returns the given default */
	getOrElse(other) {
		return this._value;
	}
	/** Applies a given function to a Left value; does nothing on the Right. */
	orElse() {
		return this;
	}
	/** Applies a function to Right and returns that value. Does nothing on the Left.*/
	chain(f) {		
		return f(this._value);
	}
	/** Throws an exception with the value in the Left. Otherwise ignores the exception and returns the valid value. */
	getOrElseThrow(_) {
		return this._value;
	}
	/** If a value is present and meets the given predicate, returns a Right describing the value. Otherwise returns an empty Left. */
	filter(f) {		
		return exports.Either.fromNullable(f(this._value) ? this._value : null);
	}

	get isRight() {
		return true;
	}

	get isLeft() {
		return false;
	}
	
	toString() {
		return `Either.Right(${this._value})`;
	}
};
